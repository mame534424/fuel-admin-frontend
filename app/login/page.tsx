"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { useAuthStore } from "@/store/authStore";

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
                router.push("/manager/dashboard");
            }
        } catch (error:any) {
            if (error.response) {
                console.error("Login error response:", error.response.data);
                alert(error.response.data.message || "Login failed");
            } else {
            console.error("Login error:", error);
        }} 
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                <h1>
                    Admin Login
                </h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

