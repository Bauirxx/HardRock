import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (<div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />);
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={cn("rounded-xl border border-border/30 bg-card overflow-hidden", className)}>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
}

function SkeletonRow({ className = '' }) {
  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-lg border border-border/30", className)}>
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonRow, SkeletonGrid }
