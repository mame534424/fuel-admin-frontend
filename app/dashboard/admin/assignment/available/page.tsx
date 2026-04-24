"use client"

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Fuel } from "lucide-react";

export default function AssignmentPage() {
const [stations,setStations]=useState<any[]>([]);
const [subStations,setSubStations]=useState<any[]>([]);

const [stationId,setStationId]=useState("");
const [subStationId,setSubStationId]=useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(()=>{
    api.get("/admin/stations").then((res)=>(
        setStations(res.data.stations)));
    api.get("/admin/subadmins").then((res)=>(
        setSubStations(res.data.subAdmins)));
    
   
}, []);
const handleSubmit=async()=>{
    setIsSubmitting(true);
    try {
        const res=await api.patch("/admin/assign-station",{
            adminId: subStationId,
            stationId
            
        });
        toast.success(res.data.message || "Manager assignment updated successfully");
        setStations([]);
        setSubStations([]);
        setStationId("");
        setSubStationId("");
    } catch (error:any) {
        console.error("Error in assigning station manager:", error);
        toast.error(error.response?.data?.message || "Failed to assign station manager");
    } finally {
        setIsSubmitting(false);
    }
}
return (
    <ProtectedRoute role="admin">
                <DashboardLayout>
                    <div className="space-y-6">
                        <Card className="fuel-canvas border-border/70 bg-card/85">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                    <ArrowRightLeft className="h-6 w-6 text-primary" />
                                    Available Change or Swap
                                </CardTitle>
                                <CardDescription>
                                    Update who manages a station. Select the station first, then choose the new manager to replace the current assignment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                <Link href="/dashboard/admin/assignments" className="text-sm text-primary underline-offset-4 hover:underline">
                                    Back to Manager Assignments
                                </Link>
                                <Link href="/dashboard/admin/assignment/new" className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                                    <Fuel className="h-3.5 w-3.5" />
                                    Go to New Assignment
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-border/70 bg-card/90">
                            <CardHeader>
                                <CardTitle className="text-lg">Change Manager Form</CardTitle>
                                <CardDescription>This updates the selected station with a different sub-admin manager.</CardDescription>
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
                            <label className="block text-sm font-medium">Select Admin</label>
                            <select
                                className="w-full rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                value={subStationId}
                                onChange={(e) => setSubStationId(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select Admin --</option>
                                {subStations.map((subStation) => (
                                    <option key={subStation.id} value={subStation.id}>
                                        {subStation.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            className="w-full md:w-auto"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !stationId || !subStationId}
                        >
                            {isSubmitting ? "Updating Assignment..." : "Assign Station Manager"}
                        </Button>

                            </CardContent>
                        </Card>

                    </div>
                </DashboardLayout>
             </ProtectedRoute>
)}
