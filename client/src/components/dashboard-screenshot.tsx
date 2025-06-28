import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Gauge, AlertTriangle, Layers } from "lucide-react";

export function DashboardScreenshot() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Mock browser header */}
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="bg-white rounded px-3 py-1 text-sm text-gray-600 flex-1 mx-4">
          shopkpi.com/dashboard
        </div>
      </div>
      
      {/* Mock dashboard content matching actual app */}
      <div className="min-h-screen bg-gray-50">
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
                    value="2024-12-01"
                    className="w-auto"
                    readOnly
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="date"
                    value="2024-12-31"
                    className="w-auto"
                    readOnly
                  />
                  <Button size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Stats Cards - matching actual component structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prints Completed</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>12.5%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <span>7-day avg: 2,654</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Misprints</p>
                    <p className="text-2xl font-bold text-gray-900">43</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-red-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>2.1%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <span>7-day avg: 38</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Order Accuracy</p>
                    <p className="text-2xl font-bold text-gray-900">98.5%</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>0.3%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <span>7-day avg: 98.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Screens Used</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>8.7%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <span>7-day avg: 115</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculated Metrics - matching actual component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Prints / Hour</p>
                    <p className="text-xl font-bold text-blue-900">356.2</p>
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
                    <p className="text-xl font-bold text-red-900">1.5%</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Screens / Job</p>
                    <p className="text-xl font-bold text-purple-900">22.4</p>
                  </div>
                  <Layers className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart placeholder matching your app */}
          <Card>
            <CardContent className="pt-6">
              <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                <div className="text-gray-600 text-center">
                  <div className="text-lg font-medium mb-2">Performance Trends Chart</div>
                  <div className="text-sm text-gray-500">Interactive Recharts visualization</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}