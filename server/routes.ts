import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertKpiReportSchema } from "@shared/schema";
import { ZodError } from "zod";

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

  // Submit KPI report
  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

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

  // Get dashboard data
  app.get("/api/dashboard", async (req, res) => {
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

      const dateRange = from && to ? { from: from as string, to: to as string } : undefined;
      const dashboardData = await storage.getDashboardData(targetUserId, dateRange);
      
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
