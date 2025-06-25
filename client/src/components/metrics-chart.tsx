import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { KpiReportWithCalculated } from "@shared/schema";
import { format, parseISO } from "date-fns";

interface MetricsChartProps {
  userId?: number;
  dateFrom: string;
  dateTo: string;
}

const metricOptions = [
  { key: "printsCompleted", label: "Prints Completed", color: "#0066CC" },
  { key: "jobsCompleted", label: "Jobs Completed", color: "#10B981" },
  { key: "orderAccuracy", label: "Order Accuracy", color: "#F59E0B" },
  { key: "misprints", label: "Misprints", color: "#EF4444" },
  { key: "screensUsed", label: "Screens Used", color: "#8B5CF6" },
  { key: "hoursWorked", label: "Hours Worked", color: "#6B7280" },
];

export function MetricsChart({ userId, dateFrom, dateTo }: MetricsChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState(["printsCompleted"]);

  const { data: reports, isLoading } = useQuery<KpiReportWithCalculated[]>({
    queryKey: ["/api/reports", userId, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId.toString());
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      
      const response = await fetch(`/api/reports?${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
  });

  const chartData = reports?.map((report) => ({
    date: format(parseISO(report.reportDate), 'MMM dd'),
    fullDate: report.reportDate,
    printsCompleted: report.printsCompleted,
    jobsCompleted: report.jobsCompleted,
    orderAccuracy: report.orderAccuracy,
    misprints: report.misprints,
    screensUsed: report.screensUsed,
    hoursWorked: report.hoursWorked,
  })).reverse() || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 lg:h-80 flex items-center justify-center text-gray-500">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle>Trends Over Time</CardTitle>
          
          <ToggleGroup
            type="multiple"
            value={selectedMetrics}
            onValueChange={setSelectedMetrics}
            className="flex flex-wrap gap-2"
          >
            {metricOptions.map((metric) => (
              <ToggleGroupItem
                key={metric.key}
                value={metric.key}
                aria-label={`Toggle ${metric.label}`}
                className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {metric.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 lg:h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? format(parseISO(item.fullDate), 'MMMM dd, yyyy') : label;
                  }}
                />
                <Legend />
                
                {selectedMetrics.map((metricKey) => {
                  const metric = metricOptions.find(m => m.key === metricKey);
                  if (!metric) return null;
                  
                  return (
                    <Line
                      key={metricKey}
                      type="monotone"
                      dataKey={metricKey}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name={metric.label}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data available for the selected period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
