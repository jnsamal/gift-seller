import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col w-full shrink-0 snap-start">
      <Skeleton className="w-full aspect-[4/5] rounded-[10px] mb-4 bg-[#E4E7E2]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/4 bg-[#E4E7E2]" />
        <Skeleton className="h-5 w-3/4 bg-[#E4E7E2]" />
        <Skeleton className="h-5 w-1/3 bg-[#E4E7E2]" />
      </div>
    </div>
  );
}
