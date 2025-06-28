import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Calendar, Filter, Search } from "lucide-react";

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
      
      {/* Mock reports page matching actual app structure */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Production Reports</h1>
              <p className="text-gray-600 mt-1">Detailed analysis and export capabilities</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, numbers..."
                    className="pl-10"
                    readOnly
                  />
                </div>
                <Input
                  type="date"
                  value="2024-12-01"
                  className="w-full"
                  readOnly
                />
                <Input
                  type="date"
                  value="2024-12-31"
                  className="w-full"
                  readOnly
                />
                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                KPI Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Job Number</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Prints</TableHead>
                      <TableHead>Misprints</TableHead>
                      <TableHead>Screens</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Dec 28, 2024</TableCell>
                      <TableCell className="font-medium">Holiday Tees</TableCell>
                      <TableCell>#2024-0287</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">Steve</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">524</TableCell>
                      <TableCell className="text-red-600">8</TableCell>
                      <TableCell className="text-purple-600">12</TableCell>
                      <TableCell>8.0h</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">98.5%</Badge>
                      </TableCell>
                      <TableCell>65.5/h</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Dec 28, 2024</TableCell>
                      <TableCell className="font-medium">Corporate Hoodies</TableCell>
                      <TableCell>#2024-0286</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">Juan</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">342</TableCell>
                      <TableCell className="text-red-600">3</TableCell>
                      <TableCell className="text-purple-600">8</TableCell>
                      <TableCell>6.5h</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">99.1%</Badge>
                      </TableCell>
                      <TableCell>52.6/h</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Dec 27, 2024</TableCell>
                      <TableCell className="font-medium">School Spirit Shirts</TableCell>
                      <TableCell>#2024-0285</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">Maddie</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">718</TableCell>
                      <TableCell className="text-red-600">12</TableCell>
                      <TableCell className="text-purple-600">15</TableCell>
                      <TableCell>7.5h</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">98.3%</Badge>
                      </TableCell>
                      <TableCell>95.7/h</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Dec 27, 2024</TableCell>
                      <TableCell className="font-medium">Band Merch Run</TableCell>
                      <TableCell>#2024-0284</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">Antonio</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">235</TableCell>
                      <TableCell className="text-red-600">2</TableCell>
                      <TableCell className="text-purple-600">6</TableCell>
                      <TableCell>4.5h</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">99.2%</Badge>
                      </TableCell>
                      <TableCell>52.2/h</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Dec 26, 2024</TableCell>
                      <TableCell className="font-medium">Custom Logo Polos</TableCell>
                      <TableCell>#2024-0283</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">Steve</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">156</TableCell>
                      <TableCell className="text-red-600">1</TableCell>
                      <TableCell className="text-purple-600">4</TableCell>
                      <TableCell>3.0h</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">99.4%</Badge>
                      </TableCell>
                      <TableCell>52.0/h</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Summary Footer */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-700">Total Jobs</div>
                    <div className="text-lg font-bold text-gray-900">5</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Total Prints</div>
                    <div className="text-lg font-bold text-green-600">1,975</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Total Misprints</div>
                    <div className="text-lg font-bold text-red-600">26</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Avg Accuracy</div>
                    <div className="text-lg font-bold text-green-600">98.7%</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Avg Rate</div>
                    <div className="text-lg font-bold text-blue-600">63.6/h</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}