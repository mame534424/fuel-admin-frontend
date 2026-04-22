"use client"
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import MetricCard from "@/components/MetricCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, MapPinned } from "lucide-react";

type AdminStats = {
    totalStations: number;
    totalSubAdmins: number;
    totalBookings: number;
    activeBookings: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        api.get("/admin/stats")
            .then((res) => {
                setStats(res.data);
            })
            .catch((err) => {
                console.error("Error fetching admin stats:", err);
            });
    }, []);

    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <div className="space-y-6">
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <Fuel className="h-6 w-6 text-primary" />
                                Admin Dashboard
                            </CardTitle>
                            <CardDescription>
                                Live overview of stations, sub-admins, and booking activity.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {stats && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard title="Total Stations" value={stats.totalStations} />
                            <MetricCard title="Total Sub-admins" value={stats.totalSubAdmins} />
                            <MetricCard title="Total Revenue" value={stats.totalBookings} />
                            <MetricCard title="Total Bookings" value={stats.activeBookings} />
                        </div>
                    )}

                    {!stats && (
                        <Card className="border-border/70 bg-card/90">
                            <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                                <MapPinned className="h-4 w-4 text-primary" />
                                Loading admin metrics...
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}