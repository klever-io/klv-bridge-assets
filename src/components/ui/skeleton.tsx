interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className = "", shimmer = true }: SkeletonProps) {
  return (
    <div
      className={`${shimmer ? "animate-shimmer" : "animate-pulse bg-[var(--muted)]"} rounded ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="border-gradient p-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}
