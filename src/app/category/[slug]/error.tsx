"use client";

import { useEffect } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { Footer } from "@/components/gifting/Footer";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF5]">
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <MainNavbar />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-heading text-[28px] lg:text-[32px] text-[#183330] font-medium mb-4">
          Couldn&apos;t load these gifts
        </h2>
        <p className="text-[15px] text-[#5F706C] max-w-md mb-8">
          We encountered an issue while loading this category. Please try again or explore our other collections.
        </p>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => reset()}
            className="h-12 px-8 rounded-md bg-[#07514D] hover:bg-[#043F3C] text-[#FCFAF5] font-medium"
          >
            Try Again
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
