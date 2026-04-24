"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightLeft, Fuel, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManagerAssignmentsLandingPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <Card className="fuel-canvas border-border/70 bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                <Fuel className="h-6 w-6 text-primary" />
                Manager Assignments
              </CardTitle>
              <CardDescription>
                Choose what you want to do. Assign a new manager to an unassigned station, or change/swap manager assignments for an existing station.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle className="text-lg">New Assignment</CardTitle>
                <CardDescription>
                  Use this when a station has no manager and you want to assign one for the first time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/admin/assignment/new"
                  className={cn(buttonVariants({ className: "w-full justify-between" }))}
                >
                  Open New Assignment
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle className="text-lg">Available Change or Swap</CardTitle>
                <CardDescription>
                  Use this when you want to replace or swap the manager currently assigned to a station.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/admin/assignment/available"
                  className={cn(buttonVariants({ variant: "outline", className: "w-full justify-between" }))}
                >
                  Open Available Change or Swap
                  <ArrowRightLeft className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
