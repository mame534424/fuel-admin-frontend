import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Activity } from "lucide-react";

export default function ManagerDashboard() {
    return (
        <ProtectedRoute role="subAdmin">
            <DashboardLayout>
                <div className="space-y-6">
                    <Card className="fuel-canvas border-border/70 bg-card/85">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                                <Fuel className="h-6 w-6 text-primary" />
                                Manager Dashboard
                            </CardTitle>
                            <CardDescription>Monitor queue, pump flow, and station operations.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4 text-primary" />
                            Your manager widgets will appear here.
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
