import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { KpiReportWithCalculated, User } from "@shared/schema";
import { format } from "date-fns";
import { Download, FileSpreadsheet, Calendar, Filter } from "lucide-react";

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header selectedUserId="" onUserChange={() => {}} />
        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                Access denied. Admin privileges required.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { data: reports = [], isLoading } = useQuery<KpiReportWithCalculated[]>({
    queryKey: ["/api/reports", selectedUserId, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedUserId && selectedUserId !== "all") {
        params.append("userId", selectedUserId);
      }
      if (dateFrom) {
        params.append("fromDate", dateFrom);
      }
      if (dateTo) {
        params.append("toDate", dateTo);
      }
      
      const response = await fetch(`/api/reports?${params}`);
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Filter reports based on search term
  const filteredReports = reports.filter(report => 
    report.jobName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.jobNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to download CSV
  const downloadCSV = () => {
    const csvHeaders = [
      "Date",
      "User",
      "Job Name", 
      "Job Number",
      "Prints Completed",
      "Misprints",
      "Screens Used",
      "Time on Job (Hours)",
      "Order Accuracy (%)",
      "Prints Per Hour",
      "Defect Rate (%)",
      "Screens Per Print"
    ];

    const csvData = filteredReports.map(report => [
      format(new Date(report.reportDate), 'yyyy-MM-dd'),
      report.userName || "",
      report.jobName || "",
      report.jobNumber || "",
      report.printsCompleted.toString(),
      report.misprints.toString(),
      report.screensUsed.toString(),
      report.timeOnJob.toFixed(2),
      report.orderAccuracy.toFixed(1),
      report.printsPerHour.toFixed(1),
      report.defectRate.toFixed(1),
      report.screensPerJob.toFixed(3)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `shop-reports-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedUserId={selectedUserId} onUserChange={setSelectedUserId} />
      
      <div className="max-w-7xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold">Job Reports</CardTitle>
              </div>
              <Button onClick={downloadCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs, numbers, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="From Date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="To Date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading reports...</div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reports found for the selected criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="whitespace-nowrap">Job Name</TableHead>
                      <TableHead className="whitespace-nowrap">Job Number</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Prints</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Misprints</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Screens</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Time (h)</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Accuracy</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Rate/h</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Defect %</TableHead>
                      <TableHead className="whitespace-nowrap text-right">Screens/Print</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{report.userName}</TableCell>
                        <TableCell className="max-w-48 truncate" title={report.jobName}>
                          {report.jobName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {report.jobNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {report.printsCompleted.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={report.misprints > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                            {report.misprints}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{report.screensUsed}</TableCell>
                        <TableCell className="text-right">{report.timeOnJob.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            report.orderAccuracy >= 95 ? "text-green-600" : 
                            report.orderAccuracy >= 90 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {report.orderAccuracy.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-blue-600 font-medium">
                            {report.printsPerHour.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            report.defectRate <= 2 ? "text-green-600" : 
                            report.defectRate <= 5 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {report.defectRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {report.screensPerJob.toFixed(3)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Summary Row */}
            {filteredReports.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-600">
                  <strong>Summary:</strong> {filteredReports.length} jobs | {' '}
                  {filteredReports.reduce((sum, r) => sum + r.printsCompleted, 0).toLocaleString()} total prints | {' '}
                  {filteredReports.reduce((sum, r) => sum + r.misprints, 0)} total misprints | {' '}
                  {filteredReports.reduce((sum, r) => sum + r.timeOnJob, 0).toFixed(1)} total hours
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}