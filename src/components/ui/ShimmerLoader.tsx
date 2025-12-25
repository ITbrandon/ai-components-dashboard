import { cn } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";

interface ShimmerLoaderProps {
  className?: string;
  lines?: number;
}

export function ShimmerLoader({ className, lines = 3 }: ShimmerLoaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function ShimmerCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <ShimmerLoader lines={2} />
    </div>
  );
}

export function ShimmerPill({ className }: { className?: string }) {
  return <Skeleton className={cn("h-8 w-24 rounded-full", className)} />;
}
