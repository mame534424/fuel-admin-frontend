"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function StationsPage() {
    const [stations, setStations] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
        
    const loadStations = async () => {
    const res = await api.get("/admin/stations");
    console.log("Fetched stations:", res.data);
    setStations(res.data.stations);
  };

  useEffect(() => {
    loadStations();
  }, []);

    const handleCreateStation = async () => {
        try {
            await api.post("/stations/create", { name, 
                latitude: Number(latitude), longitude: Number(longitude) });
            setName("");
            setLatitude("");
            setLongitude("");
            loadStations();
        } catch (err) {
            console.error("Error creating station:", err);
        }
    }
    return (
        <ProtectedRoute role="admin">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Stations
                </h1>
               <div className="bg-white p-5 rounded-2xl shadow mb-6 space-y-3">
                <h2 className="font-semibold text-gray-600">
                    Create Station
                </h2>
                <input
                    type="text"
                    placeholder="Station Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={handleCreateStation}
                >
                    Create Station
                </button>

               </div>
               <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="min-w-full">

                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-4">
                                Name
                            </th>
                            <th className="p-4">
                                Active
                            </th>
                            <th className="p-4">
                                OwnerId
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.map((station) =>(
                            <tr key={station.id} className="border-b">
                                <td className="p-4">
                                    {station.name}
                                </td>
                                <td className="p-4">
                                    {station.active ? "Yes" : "No"}
                                </td>
                                <td className="p-4">
                                    {station.ownerId}
                                </td>
                                <td className="p-4">
                                    {station.ownerId ||
                                    "Unassigned"}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            </DashboardLayout>
        </ProtectedRoute>
    );
}






