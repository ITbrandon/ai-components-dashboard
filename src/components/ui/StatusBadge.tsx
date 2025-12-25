import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Status = "idle" | "loading" | "streaming" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: null,
    text: "Ready",
    variant: "secondary" as const,
  },
  loading: {
    icon: Loader2,
    text: "Processing",
    variant: "default" as const,
  },
  streaming: {
    icon: Loader2,
    text: "Generating",
    variant: "default" as const,
  },
  success: {
    icon: CheckCircle2,
    text: "Complete",
    variant: "outline" as const,
  },
  error: {
    icon: XCircle,
    text: "Error",
    variant: "destructive" as const,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "gap-1.5",
        status === "success" && "border-success text-success",
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "w-3.5 h-3.5",
            (status === "loading" || status === "streaming") && "animate-spin"
          )}
        />
      )}
      <span>{config.text}</span>
    </Badge>
  );
}
