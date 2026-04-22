"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "../../lib/api";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Flame, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin=async () => {
        try {
            const response = await api.post("/auth/signin", { identifier:email, password:password});
            console.log("Login response:", response.data);
            const { user, token } = response.data;
            setAuth(user, token);
            if(user.role === "admin"){
                router.push("/dashboard/admin");
            }
            else if(user.role === "subAdmin"){
                router.push("/dashboard/manager");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Login error response:", error.response.data);
                alert((error.response.data as { message?: string }).message || "Login failed");
            } else {
            console.error("Login error:", error);
        }} 
    };
    return (
        <div className="fuel-canvas relative flex min-h-screen items-center justify-center px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgb(245_158_11/0.16),transparent_40%)]" />

            <Card className="relative w-full max-w-md border-border/70 bg-card/90 shadow-xl backdrop-blur-sm">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/15 p-2 text-primary">
                            <Flame className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl tracking-tight">Fuel Admin Login</CardTitle>
                            <CardDescription>Access station control and bookings</CardDescription>
                        </div>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Secure staff access only
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1"
                            placeholder="name@fuelco.com"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1"
                            placeholder="Enter your password"
                        />
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
    );
}

