import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, MessageSquare, Phone } from "lucide-react";

const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  country: z.string().min(1, "Please select your country"),
  helpType: z.string().min(1, "Please select how we can help you"),
  message: z.string().min(10, "Please provide more details (minimum 10 characters)")
});

type ContactFormData = z.infer<typeof contactSchema>;

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Mexico", "Brazil", "Japan", "Other"
];

const helpOptions = [
  "I'm new to ShopKPI and would like a demo",
  "I need help with my subscription",
  "I have a technical question",
  "I want to discuss custom features",
  "Other"
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to find out how ShopKPI can solve problems specific to your print shop business or need assistance, let's talk!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Contact us</CardTitle>
                <p className="text-sm text-gray-600">* indicates required fields</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Business Email Address *
                    </Label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="mt-1"
                      placeholder="your.email@company.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        {...register("firstName")}
                        className="mt-1"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        {...register("lastName")}
                        className="mt-1"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Country *
                    </Label>
                    <Select onValueChange={(value) => setValue("country", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  {/* Help Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      How can we help you? *
                    </Label>
                    <Select onValueChange={(value) => setValue("helpType", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {helpOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.helpType && (
                      <p className="text-sm text-red-600 mt-1">{errors.helpType.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Tell us more about your needs *
                    </Label>
                    <Textarea
                      {...register("message")}
                      className="mt-1"
                      rows={4}
                      placeholder="Please provide details about how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Get help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600">hello@wheatonshirt.com</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Our Office</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">ShopKPI HQ</h4>
                    <p className="text-sm text-gray-600">
                      123 Print Street<br />
                      Business District<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
}