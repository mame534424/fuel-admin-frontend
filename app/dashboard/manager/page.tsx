"use client";

import MetricCard from "@/components/MetricCard";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

type ManagerStats = {
    stationId: string;
    fuels: {
        fuelType: string;
        quantity: number;
        isAvailable: boolean;
        updatedAt: string;
    }[];
    bookings: {
        status: string;
        count: number;
    }[];
};

const defaultStats: ManagerStats = {
    stationId: "",
    fuels: [],
    bookings: [],
};

export default function ManagerDashboard() {
    const [stats, setStats] = useState<ManagerStats>(defaultStats);

    useEffect(() => {
        api.get("/manager/station-status")
            .then((res) => {
                setStats(res.data ?? defaultStats);
            })
            .catch((err) => {
                console.error("Error fetching manager stats:", err);
            });
    }, []);

    return (
        <ProtectedRoute role="subAdmin">
            <DashboardLayout>
                <div className="space-y-6">

                    {/* Header */}
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <Fuel className="h-6 w-6 text-primary" />
                                Manager Dashboard
                            </CardTitle>
                            <CardDescription>
                                Monitor queue, pump flow, and station operations.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Info card */}
                    <Card className="border-border/70 bg-card/90">
                        <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4 text-primary" />
                            Your manager widgets will appear here.
                        </CardContent>
                    </Card>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                        <MetricCard title="Station Id" value={stats.stationId} />

                        {stats.fuels.map((fuel) => (
                            <MetricCard
                                key={fuel.fuelType}
                                title={`${fuel.fuelType} Quantity`}
                                value={fuel.quantity}
                            />
                        ))}

                        {stats.bookings.map((booking, index) => (
                            <MetricCard
                                key={`${booking.status}-${index}`}
                                title={`${booking.status} Bookings`}
                                value={Number(booking.count)}
                            />
                        ))}

                    </div>

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}