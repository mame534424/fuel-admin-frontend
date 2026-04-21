"use client"
import {useEffect} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type Props = {
    children: React.ReactNode;
    role?:"admin" | "subAdmin";
};
export default function ProtectedRoute({ children, role }: Props) {
    const router = useRouter();
    const { user, hydrated,loadAuth,token } = useAuthStore();
    useEffect(() => {
        loadAuth();
    }, []);
    
    useEffect(() => {
        if(!hydrated) return; // wait for auth state to load
        

        if (!user) {
            router.push("/login");
        } else if (role && user.role !== role) {
            router.push("/login");
        }
    }, [user, hydrated, token, role]);
    // loading spinner
   

    if (!hydrated || !token) return <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
    </div>;
    return <>{children}</>;

}