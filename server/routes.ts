import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import Stripe from "stripe";
import { insertKpiReportSchema } from "@shared/schema";
import { ZodError } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

  // Get all users (Admin only)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user?.role !== 'admin') return res.sendStatus(403);

    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Submit KPI report - require subscription for non-admin users
  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Check subscription status for non-admin users
    if (req.user?.role !== 'admin' && req.user?.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: "Active subscription required" });
    }

    try {
      const validatedData = insertKpiReportSchema.parse(req.body);
      
      // With job-based tracking, users can submit multiple reports per day
      const report = await storage.createKpiReport(req.user!.id, validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Get KPI reports
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { userId, from, to } = req.query;
      
      // Regular users can only see their own data
      let targetUserId: number | undefined;
      if (req.user?.role === 'admin') {
        targetUserId = userId ? parseInt(userId as string) : undefined;
      } else {
        targetUserId = req.user!.id;
      }

      const reports = await storage.getKpiReports(
        targetUserId,
        from as string,
        to as string
      );
      
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get dashboard data - require subscription for non-admin users
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Check subscription status for non-admin users
    if (req.user?.role !== 'admin' && req.user?.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: "Active subscription required" });
    }

    try {
      const { userId, from, to } = req.query;
      
      // Regular users can only see their own data
      let targetUserId: number | undefined;
      if (req.user?.role === 'admin') {
        targetUserId = userId ? parseInt(userId as string) : undefined;
      } else {
        targetUserId = req.user!.id;
      }

      const dateRange = from && to ? { from: from as string, to: to as string } : undefined;
      const dashboardData = await storage.getDashboardData(targetUserId, dateRange);
      
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Stripe subscription routes
  app.post("/api/create-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { plan } = req.body;
      const user = req.user;

      if (!user.email) {
        return res.status(400).json({ error: "User email is required" });
      }

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
      }

      // Define price IDs - you'll need to set these environment variables
      const priceIds = {
        monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "price_1234567890_monthly",
        yearly: process.env.STRIPE_YEARLY_PRICE_ID || "price_1234567890_yearly"
      };

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceIds[plan as keyof typeof priceIds],
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/?subscription=success`,
        cancel_url: `${req.headers.origin}/subscribe`,
        metadata: {
          userId: user.id.toString(),
          plan: plan,
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/subscription-status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.json({ status: 'inactive' });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      await storage.updateUserSubscriptionStatus(user.id, subscription.status);
      
      res.json({
        status: subscription.status,
        plan: user.subscriptionPlan,
        current_period_end: subscription.current_period_end,
      });
    } catch (error: any) {
      console.error('Stripe subscription error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // KPI Reports routes
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only admin users can access reports
    if (req.user?.role !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const { userId, fromDate, toDate } = req.query;
      const targetUserId = userId && userId !== "all" ? parseInt(userId as string) : undefined;
      
      const reports = await storage.getKpiReports(targetUserId, fromDate as string, toDate as string);
      res.json(reports);
    } catch (error: any) {
      console.error("Reports error:", error);
      res.status(500).json({ message: "Error fetching reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
