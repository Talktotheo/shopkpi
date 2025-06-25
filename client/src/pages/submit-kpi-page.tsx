import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertKpiReportSchema, InsertKpiReport } from "@shared/schema";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type KpiFormData = InsertKpiReport;

// Generate time options in 15-minute increments from 15 minutes to 24 hours
const generateTimeOptions = () => {
  const options = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      if (hours === 0 && minutes === 0) continue; // Skip 0 minutes
      const totalHours = hours + minutes / 60;
      const label = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
      options.push({ value: totalHours, label });
    }
  }
  return options;
};

export default function SubmitKpiPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const timeOptions = generateTimeOptions();

  const form = useForm<KpiFormData>({
    resolver: zodResolver(insertKpiReportSchema),
    defaultValues: {
      reportDate: format(new Date(), 'yyyy-MM-dd'),
      jobName: "",
      jobNumber: "",
      printsCompleted: 0,
      misprints: 0,
      screensUsed: 0,
      timeOnJob: 0.25, // 15 minutes minimum
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: KpiFormData) => {
      const response = await apiRequest("POST", "/api/reports", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      form.reset({
        reportDate: format(new Date(), 'yyyy-MM-dd'),
        jobName: "",
        jobNumber: "",
        printsCompleted: 0,
        misprints: 0,
        screensUsed: 0,
        timeOnJob: 0.25,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: KpiFormData) => {
    submitMutation.mutate(data);
  };

  const clearForm = () => {
    form.reset({
      reportDate: format(new Date(), 'yyyy-MM-dd'),
      jobName: "",
      jobNumber: "",
      printsCompleted: 0,
      misprints: 0,
      screensUsed: 0,
      timeOnJob: 0.25,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedUserId="" onUserChange={() => {}} />
      
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Submit Job KPIs
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enter production metrics for each job you complete
            </p>
          </CardHeader>
          <CardContent>
            {showSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Job report submitted successfully! You can submit another job.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Top row - Job Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="jobName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Company Logo Shirts"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., JOB-2025-001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reportDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Report Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Core KPI Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="printsCompleted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Prints Completed <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="10000"
                            placeholder="e.g., 150"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="misprints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Misprints <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="1000"
                            placeholder="e.g., 3"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="screensUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Screens Used <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="1000"
                            placeholder="e.g., 8"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeOnJob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Time on Job <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseFloat(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitMutation.isPending}
                    className="flex-1"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Job Report'
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={clearForm}
                    disabled={submitMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}