import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BarChart3, TrendingUp, Users, Zap, Target, PieChart, FileSpreadsheet } from "lucide-react";
import { DashboardScreenshot } from "@/components/dashboard-screenshot";
import { DataEntriesScreenshot } from "@/components/data-entries-screenshot";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);
  const [activeTab, setActiveTab] = useState("why");

  // Check for tab parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['why', 'features', 'pricing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Track your print shop performance with live dashboards and instant insights into your daily operations."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Performance Tracking",
      description: "Monitor prints per hour, defect rates, and order accuracy to identify areas for improvement."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Team Management",
      description: "Track individual and team performance with role-based access and comprehensive reporting."
    },
    {
      icon: <FileSpreadsheet className="h-8 w-8 text-orange-600" />,
      title: "Export & Reports",
      description: "Generate detailed reports and export data to CSV for further analysis and record keeping."
    }
  ];

  const benefits = [
    "Increase productivity by 25% with data-driven insights",
    "Reduce waste and misprints through better tracking",
    "Streamline operations with automated reporting",
    "Make informed decisions with real-time analytics",
    "Scale your business with performance data",
    "Improve customer satisfaction with quality metrics"
  ];

  const plans = [
    {
      id: "monthly",
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
    {
      id: "yearly",
      name: "Pro Yearly",
      price: "$49",
      period: "per year",
      popular: true,
      features: [
        "Everything in Monthly",
        "Save $10.88 annually",
        "Priority support",
        "Advanced analytics",
        "Custom reporting"
      ]
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "why":
        return (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose ShopKPI?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform your print shop into a data-driven operation that maximizes efficiency, 
                reduces waste, and increases profitability.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </div>
        );
        
      case "what":
        return (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What We Do
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ShopKPI is a comprehensive performance tracking platform designed specifically 
                for screen-printing businesses.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {feature.icon}
                      <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Dashboard Screenshots Section */}
            <div className="space-y-16 mb-16">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Real-Time Dashboard Analytics
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Get instant insights into your print shop performance with comprehensive KPI tracking and visual analytics.
                </p>
                <DashboardScreenshot />
              </div>
              
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Detailed Job Tracking
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Track every job with precision - from prints completed to order accuracy, all in one organized view.
                </p>
                <DataEntriesScreenshot />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Built for Print Shops, By Print Shop Experts
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We understand the unique challenges of running a print shop. Our platform is designed 
                to capture the metrics that matter most to your business success.
              </p>
            </div>
          </div>
        );
        
      case "pricing":
        return (
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Choose the plan that fits your business needs. No hidden fees, cancel anytime.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg md:scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        <Zap className="h-4 w-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={`/signup?plan=${plan.id}`}>
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                All plans include a 7-day free trial. No credit card required.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span>🔒 Secure payments</span>
                <span>📧 Email support</span>
                <span>🔄 Cancel anytime</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <span className="text-lg md:text-2xl font-bold text-gray-900">ShopKPI</span>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden sm:flex items-center space-x-4 md:space-x-8">
              <button
                onClick={() => setActiveTab("why")}
                className={`px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                  activeTab === "why" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Why ShopKPI
              </button>
              <button
                onClick={() => setActiveTab("what")}
                className={`px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                  activeTab === "what" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                What we do
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                  activeTab === "pricing" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pricing
              </button>
            </div>
            
            {/* Login Button */}
            <Link href="/login">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Only show on first load */}
      {activeTab === "why" && (
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Text */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-blue-600">See the numbers,</span><br />
                  <span className="text-blue-600">find the friction,</span><br />
                  <span className="text-blue-600">print more profit.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Track job performance, monitor quality metrics, and boost productivity 
                  with real-time analytics designed specifically for screen-printing businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/auth">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => setActiveTab("what")}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              
              {/* Right Column - Visual */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Daily Performance</h3>
                    <Badge className="bg-green-100 text-green-800">+15%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prints Completed</span>
                      <span className="font-semibold">785</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Order Accuracy</span>
                      <span className="font-semibold text-green-600">98.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prints/Hour</span>
                      <span className="font-semibold text-blue-600">24.5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white rounded-lg p-3 shadow-lg">
                  <PieChart className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-lg p-3 shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">ShopKPI</span>
              </div>
              <p className="text-gray-400">
                Optimize your print shop performance with data-driven insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab("what")} className="hover:text-white">Features</button></li>
                <li><button onClick={() => setActiveTab("pricing")} className="hover:text-white">Pricing</button></li>
                <li><Link href="/auth" className="hover:text-white">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab("why")} className="hover:text-white">About</button></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/contact" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShopKPI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}