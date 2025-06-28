import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";
import { CheckCircle, ArrowLeft, Target } from "lucide-react";
import { z } from "zod";

const signupFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const { registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Get plan from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan') || 'monthly';
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      ...data,
      role: "user" as const
    });
  };

  const planDetails = {
    monthly: {
      name: "Pro Monthly",
      price: "$4.99",
      period: "per month",
      features: [
        "Unlimited job tracking",
        "Real-time KPI dashboard", 
        "Performance analytics",
        "CSV export reports",
        "Email support"
      ]
    },
    yearly: {
      name: "Pro Yearly", 
      price: "$49",
      period: "per year",
      features: [
        "Everything in Monthly",
        "Save $10.88 annually",
        "Priority support",
        "Advanced analytics", 
        "Custom reporting"
      ]
    }
  };

  const plan = planDetails[selectedPlan as keyof typeof planDetails] || planDetails.monthly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/landing" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ShopKPI</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Start your 7-day free trial with {plan.name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a strong password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                      size="lg"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Start Free Trial"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>

                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plan Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Plan</span>
                  {selectedPlan === 'yearly' && (
                    <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">7-Day Free Trial</h4>
                  <p className="text-sm text-gray-600">
                    Start using ShopKPI immediately. Your trial begins today and you won't be charged until day 8. 
                    Cancel anytime during your trial with no fees.
                  </p>
                </div>

                <div className="text-center">
                  <Link href="/?tab=pricing">
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}