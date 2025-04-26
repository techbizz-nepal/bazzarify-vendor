import { Skeleton } from "@/components/ui/skeleton";

export default function ContentSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="bg-primary h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="bg-primary h-4 w-[250px]" />
        <Skeleton className="bg-primary h-4 w-[200px]" />
      </div>
    </div>
  );
}
