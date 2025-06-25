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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type KpiFormData = InsertKpiReport;

export default function SubmitKpiPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<KpiFormData>({
    resolver: zodResolver(insertKpiReportSchema),
    defaultValues: {
      reportDate: format(new Date(), 'yyyy-MM-dd'),
      printsCompleted: 0,
      jobsCompleted: 0,
      misprints: 0,
      orderAccuracy: 0,
      screensUsed: 0,
      hoursWorked: 0,
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
        printsCompleted: 0,
        jobsCompleted: 0,
        misprints: 0,
        orderAccuracy: 0,
        screensUsed: 0,
        hoursWorked: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
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
      printsCompleted: 0,
      jobsCompleted: 0,
      misprints: 0,
      orderAccuracy: 0,
      screensUsed: 0,
      hoursWorked: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedUserId="" onUserChange={() => {}} />
      
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Submit Daily KPIs
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enter your production metrics for today
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Picker */}
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
                            placeholder="e.g., 1247"
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
                    name="jobsCompleted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Jobs Completed <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="1000"
                            placeholder="e.g., 43"
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
                            placeholder="e.g., 28"
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
                    name="orderAccuracy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Order Accuracy (%) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="e.g., 97.8"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                            placeholder="e.g., 156"
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
                    name="hoursWorked"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Hours Worked <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            placeholder="e.g., 8.5"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                    disabled={submitMutation.isPending}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit KPIs"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>KPIs submitted successfully!</strong> Your production metrics have been recorded.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center py-2 px-3 text-gray-600">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-primary">
            <i className="fas fa-plus-circle text-lg"></i>
            <span className="text-xs mt-1">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
