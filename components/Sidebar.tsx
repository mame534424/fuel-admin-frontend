"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
    const { user } = useAuthStore();
    const role = user?.role || { role: null };

    return (
        <aside className="w-64 min-h-screen bg-black text-white p-5">
            <h1 className="text-xl font-bold mb-8">
                Fuel Panel
            </h1>
            <nav className="space-y-4">
                {role === "admin" && (
                    <>
                         <Link href="/dashboard/admin">
                        Dashboard
                        </Link>
                        <br />
                        <Link href="/dashboard/admin/stations">
                        Stations
                        </Link>
                        <br />
                        <Link href="/dashboard/admin/subadmins">
                        Sub Admins
                        </Link>
                        <br />
                        <Link href="/dashboard/admin/bookings">
                        Bookings
                        </Link>
                    </>)}
                {role === "subAdmin" && (
                    <>
                        <Link href="/dashboard/manager">
                        Dashboard
                        </Link>
                        <br />
                        <Link href="/dashboard/manager/fuel">
                        Fuel
                        </Link>
                        <br />
                        <Link href="/dashboard/manager/bookings">
                        Queue
                        </Link>
                    </>)
                }
            </nav>


        </aside>
    );
};