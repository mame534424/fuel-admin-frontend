"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MapPinned, Plus, SatelliteDish } from "lucide-react";

type list = {
        id: string;
        email: string;
        username: string;
};

type subAdminResponse = {
        subAdmins: list[];
};

export default function SubAdminPage() {
    const [list,setList] = useState<list[]>([]);
    const [email,setEmail] = useState("");
    const [user, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
        
    const loadStations = async () => {
        const res = await api.get<subAdminResponse>("/admin/subadmins");
        console.log("Fetched sub-admins:", res.data);
        setList(res.data.subAdmins);
  };

  useEffect(() => {
        api
            .get<subAdminResponse>("/admin/subadmins")
            .then((res) => {
                console.log("Fetched sub-admins:", res.data);
                setList(res.data.subAdmins);
            })
            .catch((err) => {
                console.error("Error loading sub-admins:", err);
            });
  }, []);

    const handleSubAdminCreation = async () => {
        try {
            await api.post("/admin/subadmin", { email, username: user, password });
            setEmail("");
            setUsername("");
            setPassword("");
            loadStations();
        } catch (err: any) {
        console.log("Backend says:", err.response?.data.message);
        }
    }
    
    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <div className="space-y-6">
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <MapPinned className="h-6 w-6 text-primary" />
                                Stations Managers
                            </CardTitle>
                            <CardDescription>Manage sub-admins and their assigned stations</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle className="text-lg">Create Sub-Admin</CardTitle>
                            <CardDescription>Add new sub-admin with assigned stations.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoCapitalize="off"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Username"
                                    value={user}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"                           autoComplete="new-password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleSubAdminCreation} className="w-full gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Sub-Admin Manager
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle className="text-lg">Station List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Manager ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.map((subAdmin) =>(
                                        <TableRow key={subAdmin.id}>
                                            <TableCell className="font-medium">{subAdmin.email}</TableCell>
                                            <TableCell>{subAdmin.email.split("@")[0]}</TableCell>
                                            <TableCell>{subAdmin.id}</TableCell>
                                            
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

            </DashboardLayout>
        </ProtectedRoute>
    );
}






