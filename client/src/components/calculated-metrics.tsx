import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Clock, AlertTriangle, Layers } from "lucide-react";

interface CalculatedMetricsProps {
  data: {
    printsPerHour: number;
    defectRate: number;
    screensPerJob: number;
  };
}

export function CalculatedMetrics({ data }: CalculatedMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Prints / Hour</p>
              <p className="text-xl font-bold text-blue-900">
                {data.printsPerHour.toFixed(1)}
              </p>
            </div>
            <Gauge className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>



      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Defect Rate</p>
              <p className="text-xl font-bold text-red-900">
                {data.defectRate.toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Screens / Print</p>
              <p className="text-xl font-bold text-purple-900">
                {data.screensPerJob.toFixed(1)}
              </p>
            </div>
            <Layers className="h-6 w-6 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
