"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardShell from "@/components/layout/DashboardShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

export default function StudentProfile() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@university.edu",
    phone: "123-456-7890",
    emergencyContact: "Jane Doe",
    emergencyPhone: "987-654-3210",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    toast({
      title: "Profile update requested",
      description: "Your profile update has been submitted for approval.",
    });
  };

  return (
    <DashboardShell role="student">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
      </div>
      <div className="mt-2">
        <p className="text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          {/* <TabsTrigger value="room">Room Details</TabsTrigger> */}
          {/* <TabsTrigger value="payment">Payment History</TabsTrigger>   */}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details. Changes will require approval.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
                  Request Update
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* <TabsContent value="room" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
              <CardDescription>
                Details about your current housing assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium">Room Number</h3>
                  <p className="text-sm text-muted-foreground">304</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Building</h3>
                  <p className="text-sm text-muted-foreground">
                    West Campus Dormitory
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Room Type</h3>
                  <p className="text-sm text-muted-foreground">
                    Double Occupancy
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Floor</h3>
                  <p className="text-sm text-muted-foreground">3rd Floor</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Move-in Date</h3>
                  <p className="text-sm text-muted-foreground">
                    September 1, 2024
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Contract End Date</h3>
                  <p className="text-sm text-muted-foreground">May 31, 2025</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Print Room Assignment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your payment history and download receipts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium">
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="text-sm">April 1, 2025</div>
                      <div className="text-sm">$750.00</div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="text-sm">March 1, 2025</div>
                      <div className="text-sm">$750.00</div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="text-sm">February 1, 2025</div>
                      <div className="text-sm">$750.00</div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-rose-500 hover:bg-rose-600">
                Print Receipt
              </Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
      <Toaster />
    </DashboardShell>
  );
}
