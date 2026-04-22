"use client";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="fuel-canvas flex-1 min-h-screen">
                <Navbar />
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>);
}