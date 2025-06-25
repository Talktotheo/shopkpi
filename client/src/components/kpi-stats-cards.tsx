import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { DashboardData, DashboardStats } from "@shared/schema";

interface KpiStatsCardsProps {
  data: DashboardData;
}

interface StatCardProps {
  title: string;
  stats: DashboardStats;
  format?: (value: number) => string;
}

function StatCard({ title, stats, format = (v) => v.toString() }: StatCardProps) {
  const isPositive = stats.change > 0;
  const isNegative = stats.change < 0;
  const isNeutral = stats.change === 0;

  const changeColor = isPositive
    ? "text-green-600"
    : isNegative
    ? "text-red-600"
    : "text-gray-500";

  const ChangeIcon = isPositive
    ? ArrowUp
    : isNegative
    ? ArrowDown
    : Minus;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {format(stats.today)}
            </p>
          </div>
          <div className="text-right">
            <div className={`flex items-center text-sm ${changeColor}`}>
              <ChangeIcon className="h-4 w-4 mr-1" />
              <span>{Math.abs(stats.change).toFixed(1)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <span>7-day avg: </span>
          <span className="font-medium ml-1">
            {format(stats.average7Day)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiStatsCards({ data }: KpiStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Prints Completed"
        stats={data.printsCompleted}
        format={(v) => Math.round(v).toLocaleString()}
      />
      
      <StatCard
        title="Jobs Completed"
        stats={data.jobsCompleted}
        format={(v) => Math.round(v).toLocaleString()}
      />
      
      <StatCard
        title="Hours Worked"
        stats={data.hoursWorked}
        format={(v) => v.toFixed(1)}
      />
      
      <StatCard
        title="Order Accuracy"
        stats={data.orderAccuracy}
        format={(v) => `${v.toFixed(1)}%`}
      />
      
      <StatCard
        title="Misprints"
        stats={data.misprints}
        format={(v) => Math.round(v).toLocaleString()}
      />
      
      <StatCard
        title="Screens Used"
        stats={data.screensUsed}
        format={(v) => Math.round(v).toLocaleString()}
      />
    </div>
  );
}
