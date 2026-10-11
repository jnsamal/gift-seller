import { Logo } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-[#FCFAF5] flex flex-col">
      <header className="border-b border-[#E4E7E2] py-5 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
        <Logo />
      </header>

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-12 lg:py-20 flex flex-col items-center">
        <Skeleton className="w-16 h-16 rounded-full mb-8 bg-[#E4E7E2]" />
        
        <Skeleton className="h-10 w-[300px] md:w-[400px] mb-4 bg-[#E4E7E2]" />
        <Skeleton className="h-5 w-[250px] mb-10 bg-[#E4E7E2]" />

        {/* Order Status Box */}
        <div className="w-full bg-white border border-[#E4E7E2] rounded-xl p-6 lg:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-32 bg-[#E4E7E2]" />
              <Skeleton className="h-4 w-full bg-[#E4E7E2]" />
              <Skeleton className="h-4 w-4/5 bg-[#E4E7E2]" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-32 bg-[#E4E7E2]" />
              <Skeleton className="h-4 w-24 bg-[#E4E7E2]" />
              <Skeleton className="h-4 w-32 bg-[#E4E7E2]" />
              <Skeleton className="h-4 w-28 bg-[#E4E7E2]" />
            </div>
          </div>
        </div>

        {/* Items Summary Box */}
        <div className="w-full bg-white border border-[#E4E7E2] rounded-xl p-6 lg:p-8 mb-10 flex flex-col gap-6">
          <Skeleton className="h-6 w-40 bg-[#E4E7E2]" />
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-md bg-[#E4E7E2] shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4 bg-[#E4E7E2]" />
              <Skeleton className="h-3 w-1/2 bg-[#E4E7E2]" />
            </div>
            <Skeleton className="h-4 w-16 bg-[#E4E7E2] shrink-0" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Skeleton className="h-14 w-full sm:w-[200px] rounded-md bg-[#E4E7E2]" />
          <Skeleton className="h-14 w-full sm:w-[200px] rounded-md bg-[#E4E7E2]" />
        </div>
      </main>
    </div>
  );
}
