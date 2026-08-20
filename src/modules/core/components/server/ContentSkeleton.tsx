import { Skeleton } from "@/components/ui/skeleton";

export default function ContentSkeleton() {
  return (
    <div className="flex items-center space-x-4 space-y-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}
