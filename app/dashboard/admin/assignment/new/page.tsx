"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, ArrowRightLeft, Plus } from "lucide-react";


export default function NewAssignmentPage() {
    const [stations, setStations] = useState<any[]>([]);
    const [subAdmins, setSubAdmins] = useState<any[]>([]);
    const [stationId, setStationId] = useState("");
    const [subAdminId, setSubAdminId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get("/admin/assign-new-station").then((res) => {
            setStations(res.data.stations);
            setSubAdmins(res.data.subAdmins);
        });
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await api.patch("/admin/assign-station", {
            adminId: subAdminId,
            stationId: stationId
            });
            toast.success(res.data.message || "Manager assigned successfully");
            setStations([]);
            setSubAdmins([]);
        }
        catch (error: any) {
            console.error("Error in assigning station manager:", error);
            toast.error(error.response?.data?.message || "Failed to assign station manager");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <div className="space-y-6">
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <Fuel className="h-6 w-6 text-primary" />
                                Assign New Station Manager
                            </CardTitle>
                            <CardDescription>
                                Step 1: select the station that needs a manager. Step 2: select the sub-admin you want to assign. Then click Assign New Manager.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Link href="/dashboard/admin/assignments" className="text-sm text-primary underline-offset-4 hover:underline">
                                Back to Manager Assignments
                            </Link>
                            <Link href="/dashboard/admin/assignment/available" className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Go to Available Change or Swap
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle className="text-lg">Assignment Form</CardTitle>
                            <CardDescription>Only unassigned stations and available sub-admins are shown here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Select Station</label>
                        <select
                            className="w-full rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            value={stationId}
                            onChange={(e) => setStationId(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Select Station --</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>
                                    {station.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Select Sub-Admin</label>
                        <select
                            className="w-full rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            value={subAdminId}
                            onChange={(e) => setSubAdminId(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Select Sub-Admin --</option>
                            {subAdmins.map((subAdmin) => (
                                <option key={subAdmin.id} value={subAdmin.id}>
                                    {subAdmin.email}
                                </option>
                            ))}

                        </select>
                    </div>
                    <Button
                        className="w-full gap-2 md:w-auto"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !stationId || !subAdminId}
                    >
                        <Plus className="h-4 w-4" />
                        {isSubmitting ? "Assigning Manager..." : "Assign New Manager"}
                    </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );

}
