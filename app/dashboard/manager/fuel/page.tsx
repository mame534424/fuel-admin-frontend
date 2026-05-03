"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useStationStore } from "@/store/managerStore";
import axios from "axios";
import { Fuel, PlusCircle, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FuelType = {
    id: number;
    name: string;
};

type StationFuel = {
    fuelTypeId: number;
    fuelTypeName: string;
    quantity: number;
    isAvailable: boolean;
    updatedAt: string;
};

type StationStatus = {
    stationId: string;
    stationName?: string;
    fuels: StationFuel[];
    bookings: {
        status: string;
        count: number;
    }[];
};

type FuelTypesResponse = {
    fuelTypes: FuelType[];
};

type ApiMessage = {
    message?: string;
};

const emptyStationStatus: StationStatus = {
    stationId: "",
    stationName: "",
    fuels: [],
    bookings: [],
};

export default function FuelPage() {
    const stationId = useStationStore((state) => state.stationId);
    const [stationStatus, setStationStatus] = useState<StationStatus>(emptyStationStatus);
    const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
    const [createFuelTypeId, setCreateFuelTypeId] = useState("");
    const [updateFuelTypeId, setUpdateFuelTypeId] = useState("");
    const [updateQuantity, setUpdateQuantity] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    const refreshStationData = async () => {
        if (!stationId) {
            return;
        }

        setLoading(true);

        try {
            const [statusResponse, fuelTypesResponse] = await Promise.all([
                api.get<StationStatus>("/manager/station-status"),
                api.get<FuelTypesResponse>("/manager/fuel-types"),
            ]);

            const stationData = statusResponse.data ?? emptyStationStatus;
            const fuelTypeData = fuelTypesResponse.data.fuelTypes ?? [];

            setStationStatus(stationData);
            setFuelTypes(fuelTypeData);

            if (!createFuelTypeId && fuelTypeData.length) {
                setCreateFuelTypeId(String(fuelTypeData[0].id));
            }

            if (!updateFuelTypeId && stationData.fuels.length) {
                const firstFuel = stationData.fuels[0];
                setUpdateFuelTypeId(String(firstFuel.fuelTypeId));
            }
        } catch (error) {
            console.error("Error loading fuel page data:", error);
            toast.error("Failed to load fuel station data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!stationId) {
            return;
        }

        let isActive = true;

        const loadData = async () => {
            setLoading(true);

            try {
                const [statusResponse, fuelTypesResponse] = await Promise.all([
                    api.get<StationStatus>("/manager/station-status"),
                    api.get<FuelTypesResponse>("/manager/fuel-types"),
                ]);

                if (!isActive) {
                    return;
                }

                const stationData = statusResponse.data ?? emptyStationStatus;
                const fuelTypeData = fuelTypesResponse.data.fuelTypes ?? [];

                setStationStatus(stationData);
                setFuelTypes(fuelTypeData);

                if (!createFuelTypeId && fuelTypeData.length) {
                    setCreateFuelTypeId(String(fuelTypeData[0].id));
                }

                if (!updateFuelTypeId && stationData.fuels.length) {
                    const firstFuel = stationData.fuels[0];
                    setUpdateFuelTypeId(String(firstFuel.fuelTypeId ?? ""));
                }
            } catch (error) {
                if (isActive) {
                    console.error("Error loading fuel page data:", error);
                    toast.error("Failed to load fuel station data");
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadData();

        return () => {
            isActive = false;
        };
    }, [stationId, createFuelTypeId, updateFuelTypeId]);

    const currentFuelTypes = useMemo(() => {
        return stationStatus.fuels
            .map((fuel) => ({
                id: fuel.fuelTypeId,
                label: fuel.fuelTypeName,
            }))
            .filter((fuel) => fuel.id !== undefined) as { id: number; label: string }[];
    }, [stationStatus.fuels]);

   

    const handleUpdateFuel = async () => {
        if (!stationId) {
            toast.error("No station is assigned to this manager");
            return;
        }

        const parsedFuelTypeId = Number(updateFuelTypeId);
        const parsedQuantity = Number(updateQuantity);

        if (!parsedFuelTypeId || Number.isNaN(parsedFuelTypeId)) {
            toast.error("Choose a fuel type to update");
            return;
        }

        if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
            toast.error("Enter a valid quantity");
            return;
        }

        setUpdating(true);

        try {
            const response = await api.patch<ApiMessage>("/manager/update-station-fuel", {
                stationId,
                fuelTypeId: parsedFuelTypeId,
                quantity: parsedQuantity,
            });

            toast.success(response.data.message || "Fuel quantity updated");
            setUpdateQuantity("");
            await refreshStationData();
        } catch (error) {
            if (axios.isAxiosError<ApiMessage>(error)) {
                toast.error(error.response?.data?.message || "Failed to update fuel quantity");
            } else {
                toast.error("Failed to update fuel quantity");
            }
        } finally {
            setUpdating(false);
        }
    };
    

    return (
        <ProtectedRoute role="subAdmin">
            <DashboardLayout>
                <div className="space-y-6">
                <Card className="fuel-canvas border-border/70 bg-card/85">
                    <CardHeader className="space-y-4 md:flex md:flex-row md:items-end md:justify-between md:space-y-0">
                        
                        {/* LEFT SECTION */}
                        <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                            <Fuel className="h-6 w-6 text-primary" />
                            Fuel Manager
                        </CardTitle>
                        <CardDescription>
                            Add fuel to your station, top up quantities, and keep inventory easy to manage.
                        </CardDescription>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        
                        {/* BADGES */}
                        <div className="flex flex-wrap gap-2">
                            <Badge
                            variant="outline"
                            className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                            >
                            Station: {stationStatus.stationName || "Loading station..."}
                            </Badge>

                            <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1"
                            >
                            ID: {stationStatus.stationId || stationId || "N/A"}
                            </Badge>
                        </div>

                        {/* NEW BUTTON */}
                        <Button
                            onClick={() => router.push("fuel/createfuel")}
                            className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-all duration-200 
                                    hover:scale-[1.03] hover:shadow-md"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Fuel
                        </Button>

                        </div>

                    </CardHeader>
                </Card>

                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        
                        <Card className="border-border/70 bg-card/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <RotateCcw className="h-5 w-5 text-primary" />
                                    Update Fuel Quantity
                                </CardTitle>
                                <CardDescription>
                                    Pick an existing fuel and refresh its quantity when stock changes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="update-fuel-type">Current Fuel</Label>
                                    <select
                                        id="update-fuel-type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={updateFuelTypeId}
                                        onChange={(event) => setUpdateFuelTypeId(event.target.value)}
                                        disabled={loading || currentFuelTypes.length === 0}
                                    >
                                        <option value="">Select existing fuel</option>
                                        {currentFuelTypes.map((fuelType) => (
                                            <option key={fuelType.id} value={fuelType.id}>
                                                {fuelType.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="update-quantity">New Quantity</Label>
                                    <Input
                                        id="update-quantity"
                                        type="number"
                                        min="0"
                                        placeholder="Enter updated quantity"
                                        value={updateQuantity}
                                        onChange={(event) => setUpdateQuantity(event.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-primary" />
                                        <span>Low stock updates will automatically mark the fuel unavailable.</span>
                                    </div>
                                    <Button variant="outline" onClick={handleUpdateFuel} disabled={updating || loading || !currentFuelTypes.length} className="gap-2">
                                        <RotateCcw className="h-4 w-4" />
                                        {updating ? "Updating..." : "Update Quantity"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle className="text-lg">Current Station Fuel</CardTitle>
                            <CardDescription>
                                A quick view of what is already assigned to this station.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-sm text-muted-foreground">Loading station fuel...</p>
                            ) : stationStatus.fuels.length ? (
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {stationStatus.fuels.map((fuel) => (
                                        <div key={`${fuel.fuelTypeName}-${fuel.updatedAt}`} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">{fuel.fuelTypeName}</p>
                                                    <p className="text-xs text-muted-foreground">Updated {new Date(fuel.updatedAt).toLocaleString()}</p>
                                                </div>
                                                <Badge variant={fuel.isAvailable ? "success" : "warning"}>
                                                    {fuel.isAvailable ? "Available" : "Low Stock"}
                                                </Badge>
                                            </div>
                                            <p className="mt-4 text-3xl font-semibold tracking-tight">{fuel.quantity}</p>
                                            <p className="text-sm text-muted-foreground">Liters available</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
                                    No fuel has been assigned yet. Use the form above to add the first fuel type.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}