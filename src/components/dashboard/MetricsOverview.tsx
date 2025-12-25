import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  delay?: number;
}

function MetricCard({ title, value, change, icon, delay = 0 }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="hover:border-primary/30 transition-colors group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
              {icon}
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1",
                isPositive 
                  ? "border-success/50 bg-success/10 text-success" 
                  : "border-destructive/50 bg-destructive/10 text-destructive"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MetricsOverview() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$48,294",
      change: 12.5,
      icon: <DollarSign className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />,
    },
    {
      title: "Active Users",
      value: "2,847",
      change: 8.2,
      icon: <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />,
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: -2.1,
      icon: <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />,
    },
    {
      title: "API Requests",
      value: "1.2M",
      change: 23.8,
      icon: <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={metric.title} {...metric} delay={i * 0.1} />
      ))}
    </div>
  );
}
