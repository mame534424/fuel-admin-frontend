import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Gauge, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="fuel-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl border-border/70 bg-card/90 shadow-xl">
        <CardHeader>
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Secure Fleet Controls
          </div>
          <CardTitle className="flex items-center gap-2 text-3xl tracking-tight">
            <Gauge className="h-7 w-7 text-primary" />
            Fuel Management System
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Centralized operations for station monitoring, team access, and booking flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className={buttonVariants({ className: "inline-flex w-full items-center gap-2 md:w-auto" })}>
              Open Admin Login
              <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
