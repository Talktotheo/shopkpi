import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { SubscriptionGuard } from "@/lib/subscription-guard";
import { KpiStatsCards } from "@/components/kpi-stats-cards";
import { CalculatedMetrics } from "@/components/calculated-metrics";
import { MetricsChart } from "@/components/metrics-chart";
import { JobsTable } from "@/components/jobs-table";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardData } from "@shared/schema";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return format(date, 'yyyy-MM-dd');
  });
  const [dateTo, setDateTo] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard", selectedUserId, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedUserId && selectedUserId !== "all") params.append("userId", selectedUserId);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      
      const response = await fetch(`/api/dashboard?${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      return response.json();
    },
  });

  const updateDateRange = () => {
    refetchDashboard();
  };

  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          selectedUserId={selectedUserId}
          onUserChange={setSelectedUserId}
        />
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-4" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gray-50">
        <Header 
          selectedUserId={selectedUserId}
          onUserChange={setSelectedUserId}
        />
        
        <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Date Range Picker */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Production Dashboard
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700">Date Range:</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-auto"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-auto"
                />
                <Button onClick={updateDateRange} size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Stats Cards */}
        {dashboardData && <KpiStatsCards data={dashboardData} />}

        {/* Calculated Metrics */}
        {dashboardData && <CalculatedMetrics data={dashboardData.calculatedMetrics} />}

        {/* Charts */}
        <MetricsChart 
          userId={selectedUserId} 
          dateFrom={dateFrom} 
          dateTo={dateTo} 
        />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center py-2 px-3 text-primary">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    </SubscriptionGuard>
  );
}
