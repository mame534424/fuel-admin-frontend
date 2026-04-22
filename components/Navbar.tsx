"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/dist/client/components/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const { user, logOut } = useAuthStore();

    const handleLogout = () => {
        logOut();
        router.push("/login");
    }


    return (
        <header className="sticky top-0 z-20 h-16 border-b border-border/70 bg-card/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <UserRound className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                        <h2 className="text-sm font-medium text-muted-foreground">Signed in as</h2>
                        <p className="text-sm font-semibold tracking-tight">{user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )}