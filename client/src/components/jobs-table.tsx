import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { KpiReportWithCalculated, User } from "@shared/schema";
import { format } from "date-fns";
import { Search, Calendar } from "lucide-react";

interface JobsTableProps {
  selectedUserId: string;
}

export function JobsTable({ selectedUserId }: JobsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const { data: reports = [], isLoading } = useQuery<KpiReportWithCalculated[]>({
    queryKey: ["/api/reports", selectedUserId || "all", dateFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedUserId && selectedUserId !== "all") {
        params.append("userId", selectedUserId);
      }
      if (dateFilter) {
        params.append("fromDate", dateFilter);
        params.append("toDate", dateFilter);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Completed Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Completed Jobs
        </CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, job numbers, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No jobs found for the selected criteria
          </div>
        ) : (
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
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {report.jobName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.jobNumber}</Badge>
                    </TableCell>
                    <TableCell>{report.userName}</TableCell>
                    <TableCell>{report.printsCompleted}</TableCell>
                    <TableCell>
                      <span className={report.misprints > 0 ? "text-red-600" : "text-green-600"}>
                        {report.misprints}
                      </span>
                    </TableCell>
                    <TableCell>{report.screensUsed}</TableCell>
                    <TableCell>{report.timeOnJob.toFixed(1)}h</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        report.orderAccuracy >= 95 ? "text-green-600" : 
                        report.orderAccuracy >= 90 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {report.orderAccuracy.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-medium">
                        {report.printsPerHour.toFixed(1)}/h
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}