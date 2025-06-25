import { useAuth } from "@/hooks/use-auth";
import { Loader2, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function SubscriptionGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Admin users always have access
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  // Regular users need active subscription
  if (user?.subscriptionStatus !== 'active') {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Subscription Required
            </CardTitle>
            <p className="text-gray-600">
              You need an active ShopKPI Pro subscription to access this feature.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>✓ Unlimited job tracking</p>
              <p>✓ Real-time analytics dashboard</p>
              <p>✓ Performance reports</p>
              <p>✓ CSV data export</p>
            </div>
            <Link href="/subscribe">
              <Button className="w-full" size="lg">
                View Pricing Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}