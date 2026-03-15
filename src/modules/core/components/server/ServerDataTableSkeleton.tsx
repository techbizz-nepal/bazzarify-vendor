import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ServerDataTableSkeletonProps {
  title?: string;
  filterCount?: number;
  rowCount?: number;
}

export default function ServerDataTableSkeleton({
  title,
  filterCount = 2,
  rowCount = 8,
}: ServerDataTableSkeletonProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-3">
        {title ? <CardTitle className="text-2xl">{title}</CardTitle> : null}
        <Skeleton className="h-4 w-80 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-72 max-w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: filterCount }).map((_, index) => (
                <div key={`filter-skeleton-${index}`} className="flex gap-2">
                  <Skeleton className="h-10 w-[220px]" />
                  <Skeleton className="h-10 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <div className="border-b p-4">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: rowCount }).map((_, index) => (
              <Skeleton
                key={`row-skeleton-${index}`}
                className="h-4 w-full"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
