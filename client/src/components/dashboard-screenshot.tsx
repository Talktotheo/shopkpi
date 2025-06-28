import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      
      {/* Mock dashboard content */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Date Range:</span>
            <span className="bg-white px-2 py-1 rounded border">Dec 1-31, 2024</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600">Prints Completed</div>
              <div className="text-xs text-green-600 mt-1">↗ +12.5% vs yesterday</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">43</div>
              <div className="text-sm text-gray-600">Misprints</div>
              <div className="text-xs text-red-600 mt-1">↗ +2.1% vs yesterday</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-600">Order Accuracy</div>
              <div className="text-xs text-green-600 mt-1">↗ +0.3% vs yesterday</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">127</div>
              <div className="text-sm text-gray-600">Screens Used</div>
              <div className="text-xs text-green-600 mt-1">↗ +8.7% vs yesterday</div>
            </CardContent>
          </Card>
        </div>

        {/* Calculated Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">356</div>
              <div className="text-sm text-gray-600">Prints per Hour</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">1.5%</div>
              <div className="text-sm text-gray-600">Defect Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">22.4</div>
              <div className="text-sm text-gray-600">Screens per Job</div>
            </CardContent>
          </Card>
        </div>

        {/* Mock chart area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-lg font-semibold mb-2">📊 Interactive Charts</div>
                <div className="text-sm">Real-time performance tracking</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}