"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Phone} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
// Form schema with validation
const formSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number."),
  city: z.string().min(2, "Please enter your city."),
  country: z.string().min(2, "Please select your country."),
  priority: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});
export const Alertform = () => {
    const[isloading,setIsLoading]=useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      city: "",
      country: "",
      priority: "high",
      terms: false,
    },
  });
  const create = useMutation(api.alerts.createuser);
  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
  setIsLoading(true)
    try {
      create({
        city:data.city,
        country:data.country,
        phonenumber: data.phone,

      });
      toast.success("Alert preferences saved successfully!", {
        description: "You will now receive alerts based on your preferences.",
      });
    } catch {
      toast.error("something went wrong");
    } finally {
      form.reset();
      setIsLoading(false)
    }
  };


  return (
    <div className="w-full py-2 px-4  ">
      <div className="mb-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
          Disaster Alert Subscription
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sign up to receive critical alerts about natural disasters and extreme
          weather events in your area. Your safety is our priority.
        </p>
      </div>
      <Card className="border-climate-blue/20">
        <CardHeader className="bg-climate-lightBlue rounded-t-lg">
          <div className="flex items-center gap-2 mb-">
            <Badge className="bg-climate-blue text-white">New</Badge>
            <Badge
              variant="outline"
              className="text-climate-blue border-climate-blue"
            >
              Priority Alerts
            </Badge>
          </div>
          <CardTitle className="text-2xl">
            Personal Alert Registration
          </CardTitle>
          <CardDescription>
            Complete this form to customize your disaster alert preferences. All
            fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y">
                <h3 className="text-lg font-medium">Personal Information</h3>

                <div className="grid md:grid-cols-2 gap-">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background px-3 text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            <Input
                              type="tel"
                              placeholder="(123) 456-7890"
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1 pt-1 border-t">
                  <h3 className="text-lg font-medium">Location Information</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="enter your country"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions *
                        </FormLabel>
                        <FormDescription>
                          By checking this box, you agree to receive disaster
                          alerts and allow us to use your location data to
                          provide relevant alerts.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            disabled={isloading}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-blue-500 hover:bg-blue-500/90 border"
          >
            Subscribe to Alerts
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            We prioritize your privacy. Your information will only be used to
            send alerts and will never be shared with third parties.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
