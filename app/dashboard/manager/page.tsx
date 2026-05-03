"use client";

import MetricCard from "@/components/MetricCard";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useStationStore } from "@/store/managerStore";

type ManagerStats = {
    stationId: string;
    stationName:string;
    fuels: {
        fuelType: string;
        fuelTypeName:string
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
    stationName:"",
    fuels: [],
    bookings: [],
};

export default function ManagerDashboard() {
    const [stats, setStats] = useState<ManagerStats>(defaultStats);
    const setStationId = useStationStore((state) => state.setStationId);
    const setStationName=useStationStore((state)=>state.setStationName);

    useEffect(() => {
        api.get("/manager/station-status")
            .then((res) => {
                setStats(res.data ?? defaultStats);
                setStationId(res.data.stationId);
                setStationName(res.data.stationName);
            })
            .catch((err) => {
                console.error("Error fetching manager stats:", err);
            });
    }, [setStationId]);

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
                    {!stats&&(<Card className="border-border/70 bg-card/90">
                        <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4 text-primary" />
                            Your manager widgets will appear here.
                        </CardContent>
                    </Card>)}

                    {/* Metrics */}
                   {stats && (
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

                    </div>)}

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}