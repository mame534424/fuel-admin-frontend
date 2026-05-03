"use client";

import { Card } from "@/components/ui/card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useStationStore } from "@/store/managerStore";
import { toast } from "sonner";
import axios from "axios";
import { stat } from "fs";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

type ApiMessage = {
    message?: string;
};
type FuelTypesResponse = {
    fuelTypes: {
        id: string;
        name: string;
    }[];
};


export default function CreateFuelPage() {
    const [fuelTypes, setFuelTypes] = useState<{ id: string; name: string }[]>([]);
    const [createFuelTypeId, setCreateFuelTypeId] = useState("");
    const [createQuantity, setCreateQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const stationId = useStationStore((state) => state.stationId);
    const stationName = useStationStore((state) => state.stationName);


    useEffect(() => {
        if (!stationId) {
            return;
        }

        let isActive = true;

        const loadData = async () => {
            setLoading(true);

            try {
                const fuelTypesResponse=await api.get<FuelTypesResponse>("/manager/fuel-types");

                if (!isActive) {
                    return;
                }
                const fuelTypeData = fuelTypesResponse.data.fuelTypes ?? [];
                setFuelTypes(fuelTypeData);

                if (!createFuelTypeId && fuelTypeData.length) {
                    setCreateFuelTypeId(String(fuelTypeData[0].id));
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
    }, [stationId, createFuelTypeId]);



    const handleCreateFuel = async () => {
        if (!stationId) {
            toast.error("No station is assigned to this manager,reload it to get it");
            return;
        }

        const parsedFuelTypeId = Number(createFuelTypeId);
        const parsedQuantity = Number(createQuantity);

        if (!parsedFuelTypeId || Number.isNaN(parsedFuelTypeId)) {
            toast.error("Select a fuel type");
            return;
        }

        if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
            toast.error("Enter a valid quantity");
            return;
        }

        setCreating(true);

        try {
            const response = await api.post<ApiMessage>("/manager/station-fuel", {
                stationId,
                fuelTypeId: parsedFuelTypeId,
                quantity: parsedQuantity,
            });

            toast.success(response.data.message || "Fuel added to station");
            setCreateQuantity("");
        } catch (error) {
            if (axios.isAxiosError<ApiMessage>(error)) {
                toast.error(error.response?.data?.message || "Failed to create station fuel");
            } else {
                toast.error("Failed to create station fuel");
            }
        } finally {
            setCreating(false);
        }
    };


    return (
        <ProtectedRoute role="subAdmin">
                    <DashboardLayout>
                        <div className="fuel-canvas flex min-h-screen items-center justify-center px-4 py-10">
                        <Card className="border-border/70 bg-card/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <PlusCircle className="h-5 w-5 text-primary" />
                                    Add Station Fuel
                                </CardTitle>
                                <CardDescription>
                                    Choose a fuel type from the dropdown and assign an initial quantity to your station.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="create-station-name">Station Name</Label>
                                    <Input id="create-station-name" value={stationName || stationId || ""} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-fuel-type">Fuel Type</Label>
                                    <select
                                        id="create-fuel-type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={createFuelTypeId}
                                        onChange={(event) => setCreateFuelTypeId(event.target.value)}
                                        disabled={loading || fuelTypes.length === 0}
                                    >
                                        <option value="">Select fuel type</option>
                                        {fuelTypes.map((fuelType) => (
                                            <option key={fuelType.id} value={fuelType.id}>
                                                {fuelType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-quantity">Quantity</Label>
                                    <Input
                                        id="create-quantity"
                                        type="number"
                                        min="0"
                                        placeholder="Enter quantity"
                                        value={createQuantity}
                                        onChange={(event) => setCreateQuantity(event.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span>Fuel types are loaded from the API for fast, accurate selection.</span>
                                    </div>
                                    <Button onClick={handleCreateFuel} disabled={creating || loading || !fuelTypes.length} className="gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        {creating ? "Adding..." : "Add Fuel"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    </DashboardLayout>
        </ProtectedRoute>
    );
}