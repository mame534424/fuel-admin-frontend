"use client"
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import MetricCard from "@/components/MetricCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

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
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard title="Total Stations" value={stats.totalStations} />
                            <MetricCard title="Total Sub-admins" value={stats.totalSubAdmins} />
                            <MetricCard title="Total Revenue" value={stats.totalBookings} />
                            <MetricCard title="Total Bookings" value={stats.activeBookings} />
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}