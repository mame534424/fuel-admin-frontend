import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetricCard({ title, value }: { title: string; value: any}) {
    return (
        <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            </CardContent>
        </Card>
    );
}