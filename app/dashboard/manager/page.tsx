import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function ManagerDashboard() {
    return (
        <ProtectedRoute role="subAdmin">
            <DashboardLayout>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
