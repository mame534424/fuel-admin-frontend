"use client"

import api from "@/lib/api";
import { useEffect, useState } from "react"

export default function AssignmentPage() {
const [stations,setStations]=useState<any[]>([]);
const [subStations,setSubStations]=useState<any[]>([]);

const [stationId,setStationId]=useState("");
const [subStationId,setSubStationId]=useState("");

useEffect(()=>{
    api.get("/admin/stations").then((res)=>(
        setStations(res.data.stations)));
    api.get("/admin/subadmins").then((res)=>(
        setSubStations(res.data.subAdmins)));
    
   
}, []);
const handleSubmit=async()=>{
    try {
        const res=await api.patch("/admin/assign-station",{
            adminId: subStationId,
            stationId
            
        });
        alert(res.data.message);
    } catch (error:any) {
        console.error("Error in assigning station manager:", error);
        alert(error.response?.data?.message || "Failed to assign station manager");
    }
}
return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">change Station Manager</h2>
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
            <label className="block mb-2 font-medium">Select Admin:</label>
            <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={subStationId}
                onChange={(e) => setSubStationId(e.target.value)}
            >
                <option value="">-- Select Admin --</option>
                {subStations.map((subStation) => (
                    <option key={subStation.id} value={subStation.id}>
                        {subStation.email}
                    </option>
                ))}
            </select>
        </div>
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
        >
            Assign Station Manager
        </button>

    </div>
)}
