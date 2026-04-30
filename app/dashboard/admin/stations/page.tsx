"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
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

type Station = {
        id: string;
        name: string;
        isActive: boolean;
        ownerId: string | null;
        code: string;
};

type StationsResponse = {
        stations: Station[];
};

type ApiMessage = {
    message?: string;
};

export default function StationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shortcode, setShortcode] = useState("");
        
    const loadStations = async () => {
        const res = await api.get<StationsResponse>("/admin/stations");
    console.log("Fetched stations:", res.data);
    setStations(res.data.stations);
  };

  useEffect(() => {
        api
            .get<StationsResponse>("/admin/stations")
            .then((res) => {
                console.log("Fetched stations:", res.data);
                setStations(res.data.stations);
            })
            .catch((err) => {
                console.error("Error loading stations:", err);
            });
  }, []);

    const handleCreateStation = async () => {
        setIsSubmitting(true);
        try {
            const response = await api.post<ApiMessage>("/stations/create", { name,
                latitude: Number(latitude), longitude: Number(longitude), code: shortcode });
            setName("");
            setLatitude("");
            setLongitude("");
            setShortcode("");
            toast.success(response.data.message || "Created successfully");
            loadStations();
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiMessage>(err)) {
                toast.error(err.response?.data?.message || "Failed to create station");
                return;
            }
            toast.error("Failed to create station");
        }
        finally { setIsSubmitting(false);
        }
        
    }
    const handleToggleStatus=async(stationId:string, isActive:boolean)=>{
        try {
            const res=await api.patch(`/admin/${stationId}/toggle-status`,
                {isActive: !isActive }
            );
            toast.success(res.data.message || "Station status updated successfully");
            console.log("Station status toggled:", res.data);
            loadStations();
        } catch (error) {
            console.error("Error toggling station status:", error);
            toast.error("Failed to toggle station status");
        }
    };

    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <div className="space-y-6">
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <MapPinned className="h-6 w-6 text-primary" />
                                Stations
                            </CardTitle>
                            <CardDescription>Manage fuel station locations and assignments.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle className="text-lg">Create Station</CardTitle>
                            <CardDescription>Add new station coordinates for dispatch mapping.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="name">Station Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Station Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortcode">Station Code</Label>
                                <Input
                                    id="shortcode"
                                    type="text"
                                    placeholder="Station Code"
                                    value={shortcode}
                                    onChange={(e) => setShortcode(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    placeholder="Latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    placeholder="Longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button 
                                onClick={handleCreateStation}
                                disabled={isSubmitting}
                                 className="w-full gap-2">
                                    <Plus className="h-4 w-4" />
                                    {isSubmitting ? "Creating..." : "Create Station"}
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Owner Id</TableHead>
                                        <TableHead>Assignment</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stations.map((station) =>(
                                        <TableRow key={station.id}>
                                            <TableCell className="font-medium">{station.name}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleToggleStatus(station.id, station.isActive)}>
                                                     {station.isActive ? (
                                                    <Badge variant="success">Active</Badge>
                                                ) : (
                                                    <Badge variant="warning">Inactive</Badge>
                                                )}
                                                </Button>
                                               
                                            </TableCell>
                                            <TableCell>{station.ownerId}</TableCell>
                                            <TableCell>
                                                {station.ownerId || (
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                        <SatelliteDish className="h-3.5 w-3.5" />
                                                        Unassigned
                                                    </span>
                                                )}
                                            </TableCell>
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






