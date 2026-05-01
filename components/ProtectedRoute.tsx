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
    const { user, hydrated,loadAuth,token } = useAuthStore();// from zustand store
    useEffect(() => {
        loadAuth();
    }, [loadAuth]);
    
    useEffect(() => {
        if (!hydrated) return; // wait for hydration to complete

        if (!token || !user) {
        router.replace("/login");
        return;
        }

        if (role && user.role !== role) {
        router.replace("/login");
    }
    }, [user, hydrated, token, role,router]);
    // loading spinner
   

    

  // 🔒 No token yet = wait (avoid flashing dashboard)
  if (!token || !user) {
    return null;
  }

  // 🔒 Wrong role = wait while redirecting
  if (role && user.role !== role) {
    return null;
  }
  return <>{children}</>;

}