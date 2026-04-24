"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";


export default function NewAssignmentPage() {
    const [stations, setStations] = useState<any[]>([]);
    const [subAdmins, setSubAdmins] = useState<any[]>([]);
    const [stationId, setStationId] = useState("");
    const [subAdminId, setSubAdminId] = useState("");

    useEffect(() => {
        api.get("/admin/assign-new-station").then((res) => {
            setStations(res.data.stations);
            setSubAdmins(res.data.subAdmins);
        });
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await api.patch("/admin/assign-station", {
            adminId: subAdminId,
            stationId: stationId
            });
            alert(res.data.message);
        }
        catch (error: any) {
            console.error("Error in assigning station manager:", error);
            alert(error.response?.data?.message || "Failed to assign station manager");
        }
    };
    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Assign new Station Manager</h2>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Select Station:</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={stationId}
                            onChange={(e) => setStationId(e.target.value)}
                        >
                            <option value="">-- Select Station --</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>
                                    {station.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Select Sub-Admin:</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={subAdminId}
                            onChange={(e) => setSubAdminId(e.target.value)}
                        >
                            <option value="">-- Select Sub-Admin --</option>
                            {subAdmins.map((subAdmin) => (
                                <option key={subAdmin.id} value={subAdmin.id}>
                                    {subAdmin.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        Assign new Manager
                    </button>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );

}
