import { Skeleton } from "@/components/ui/skeleton";

export default function Component() {
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="w-full flex-1 space-y-6 p-8">
        <Skeleton className="h-8 w-64" />

        <div className="mb-4 flex w-full justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>

        {[1, 2, 3].map((_, index: number) => (
          <div
            key={index + new Date().toDateString()}
            className="flex items-center justify-between border-t py-4"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
