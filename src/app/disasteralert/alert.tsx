"use client"
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MapPin, Phone, Mail, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';


// Form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().min(5, "Please enter your address."),
  city: z.string().min(2, "Please enter your city."),
  state: z.string().min(2, "Please enter your state/province."),
  zipCode: z.string().min(3, "Please enter your postal/zip code."),
  country: z.string().min(2, "Please select your country."),
  notificationMethod: z.array(z.string()).min(1, "Select at least one notification method."),
  alertTypes: z.array(z.string()).min(1, "Select at least one alert type."),
  priority: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

const DisasterAlertForm = () => {
  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notificationMethod: [],
      alertTypes: [],
      priority: "high",
      terms: false,
    },
  });

  const create=useMutation(api.alerts.createuser);
  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    try{
      create({
        city:data.city,
        country:data.country,
        loacation: data.address,
        zip: data.zipCode,
        phonenumber: data.phone
      });
      toast.success("Alert preferences saved successfully!", {
        description: "You will now receive alerts based on your preferences.",
      });
    }catch{
      toast.error("something went wrong")
    }finally{
      form.reset();
    }
   
  };

  // Options for various form selects
  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "nz", label: "New Zealand" },
    { value: "other", label: "Other" }
  ];

  const alertTypes = [
    { id: "extreme-weather", label: "Extreme Weather" },
    { id: "natural-disasters", label: "Natural Disasters" },
    { id: "wildfires", label: "Wildfires" },
    { id: "flooding", label: "Flooding" },
    { id: "earthquakes", label: "Earthquakes" },
    { id: "hurricanes", label: "Hurricanes & Typhoons" }
  ];

  const notificationMethods = [
    { id: "email", label: "Email", icon: <Mail className="h-4 w-4 mr-2" /> },
    { id: "sms", label: "SMS", icon: <Phone className="h-4 w-4 mr-2" /> },
    { id: "app", label: "Mobile App", icon: <Bell className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Disaster Alert Subscription</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sign up to receive critical alerts about natural disasters and extreme weather events in your area.
          Your safety is our priority.
        </p>
      </div>

      <Card className="border-climate-blue/20">
        <CardHeader className="bg-climate-lightBlue rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-climate-blue text-white">New</Badge>
            <Badge variant="outline" className="text-climate-blue border-climate-blue">
              Priority Alerts
            </Badge>
          </div>
          <CardTitle className="text-2xl">Personal Alert Registration</CardTitle>
          <CardDescription>
            Complete this form to customize your disaster alert preferences. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Location Information</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background px-3 text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <Input 
                            placeholder="123 Main St." 
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-0" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Alert Preferences</h3>
                
                <FormField
                  control={form.control}
                  name="notificationMethod"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Notification Methods *</FormLabel>
                        <FormDescription>
                          Select how you would like to receive alerts (select at least one)
                        </FormDescription>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {notificationMethods.map((method) => (
                          <FormField
                            key={method.id}
                            control={form.control}
                            name="notificationMethod"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={method.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(method.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, method.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== method.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center">
                                      {method.icon}
                                      {method.label}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alertTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Alert Types *</FormLabel>
                        <FormDescription>
                          Select the types of alerts you want to receive
                        </FormDescription>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {alertTypes.map((type) => (
                          <FormField
                            key={type.id}
                            control={form.control}
                            name="alertTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type.id}
                                  className="flex flex-row items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, type.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== type.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {type.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Alert Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="high" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              High (All alerts)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Medium (Important alerts only)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="low" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Low (Critical alerts only)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          By checking this box, you agree to receive disaster alerts and allow us to use your location data to provide relevant alerts.
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
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-climate-blue hover:bg-climate-blue/90 border"
          >
            Subscribe to Alerts
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            We prioritize your privacy. Your information will only be used to send alerts
            and will never be shared with third parties.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DisasterAlertForm;

