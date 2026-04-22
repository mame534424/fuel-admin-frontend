"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/dist/client/components/navigation";

export default function Navbar() {
    const router = useRouter();
    const { user, logOut } = useAuthStore();

    const handleLogout = () => {
        logOut();
        router.push("/login");
    }


    return (
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
            <h2 className="font-semibold">
                Welcome {user?.email}
            </h2>
            <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
            >
               logout 
            </button>

        </header>
    )}