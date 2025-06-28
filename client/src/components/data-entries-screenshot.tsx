import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DataEntriesScreenshot() {
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
          shopkpi.com/reports
        </div>
      </div>
      
      {/* Mock data entries table */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Reports</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">December 2024</Badge>
            <Badge variant="outline">All Users</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent KPI Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 py-3 px-4 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                <div>Date</div>
                <div>Job Name</div>
                <div>Job #</div>
                <div>Prints</div>
                <div>Misprints</div>
                <div>Screens</div>
                <div>Accuracy</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-7 gap-4 py-3 px-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">Dec 28</div>
                  <div className="text-sm font-medium text-gray-900">Holiday Tees</div>
                  <div className="text-sm text-gray-600">#2024-0287</div>
                  <div className="text-sm text-green-600 font-semibold">524</div>
                  <div className="text-sm text-red-600">8</div>
                  <div className="text-sm text-purple-600">12</div>
                  <div className="text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">98.5%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 py-3 px-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">Dec 28</div>
                  <div className="text-sm font-medium text-gray-900">Corporate Hoodies</div>
                  <div className="text-sm text-gray-600">#2024-0286</div>
                  <div className="text-sm text-green-600 font-semibold">342</div>
                  <div className="text-sm text-red-600">3</div>
                  <div className="text-sm text-purple-600">8</div>
                  <div className="text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">99.1%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 py-3 px-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">Dec 27</div>
                  <div className="text-sm font-medium text-gray-900">School Spirit Shirts</div>
                  <div className="text-sm text-gray-600">#2024-0285</div>
                  <div className="text-sm text-green-600 font-semibold">718</div>
                  <div className="text-sm text-red-600">12</div>
                  <div className="text-sm text-purple-600">15</div>
                  <div className="text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">98.3%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 py-3 px-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">Dec 27</div>
                  <div className="text-sm font-medium text-gray-900">Band Merch Run</div>
                  <div className="text-sm text-gray-600">#2024-0284</div>
                  <div className="text-sm text-green-600 font-semibold">235</div>
                  <div className="text-sm text-red-600">2</div>
                  <div className="text-sm text-purple-600">6</div>
                  <div className="text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">99.2%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 py-3 px-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">Dec 26</div>
                  <div className="text-sm font-medium text-gray-900">Custom Logo Polos</div>
                  <div className="text-sm text-gray-600">#2024-0283</div>
                  <div className="text-sm text-green-600 font-semibold">156</div>
                  <div className="text-sm text-red-600">1</div>
                  <div className="text-sm text-purple-600">4</div>
                  <div className="text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">99.4%</Badge>
                  </div>
                </div>
              </div>

              {/* Summary Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700">
                  <div>Totals:</div>
                  <div>5 Jobs</div>
                  <div>-</div>
                  <div className="text-green-600">1,975</div>
                  <div className="text-red-600">26</div>
                  <div className="text-purple-600">45</div>
                  <div>
                    <Badge className="bg-green-600 text-white">98.7%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}