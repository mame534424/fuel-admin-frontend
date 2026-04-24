"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Gauge, LayoutDashboard, MapPinned, ShieldCheck, ClipboardList, Fuel } from "lucide-react";

export default function Sidebar() {
    const { user } = useAuthStore();
    const role = user?.role || { role: null };

    return (
        <aside className="hidden md:block w-72 shrink-0 sticky top-0 h-screen border-r bg-card p-5">
            <div className="mb-8 rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/20 p-2 text-accent-foreground dark:text-accent">
                        <Gauge className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Fuel Command</h1>
                        <p className="text-xs text-muted-foreground">Management Console</p>
                    </div>
                </div>
            </div>

            <nav className="space-y-2 text-sm">
                {role === "admin" && (
                    <>
                         <Link href="/dashboard/admin" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                        </Link>
                        <Link href="/dashboard/admin/stations" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <MapPinned className="h-4 w-4" />
                        Stations
                        </Link>
                        <Link href="/dashboard/admin/subAdmins" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        Sub Admins
                        </Link>
                        <Link href="/dashboard/admin/bookings" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <ClipboardList className="h-4 w-4" />
                        Bookings
                        </Link>
                    </>)}
                {role === "subAdmin" && (
                    <>
                        <Link href="/dashboard/manager" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                        </Link>
                        <Link href="/dashboard/manager/fuel" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <Fuel className="h-4 w-4" />
                        Fuel
                        </Link>
                        <Link href="/dashboard/manager/bookings" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <ClipboardList className="h-4 w-4" />
                        Queue
                        </Link>
                    </>)
                }
            </nav>


        </aside>
    );
};