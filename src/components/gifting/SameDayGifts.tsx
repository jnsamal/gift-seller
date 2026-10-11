"use client";

import { useState } from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sameDayProducts } from "@/data/sameDayProducts";
import { ProductCard } from "@/components/gifting/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function SameDayGifts() {
  // Simulated location state to demonstrate connection to Delivery Intent
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Graceful empty state
  if (!sameDayProducts || sameDayProducts.length === 0) {
    return (
      <section className="pt-[80px] pb-[80px] bg-[#F4F2EA] w-full flex flex-col items-center justify-center gap-4">
        <p className="text-[#183330] font-medium">No same-day gifts are available for this location right now.</p>
        <Link href="/category/all" className="text-sm font-medium text-[#07514D] hover:text-[#D2A01F] transition-colors flex items-center gap-1">
          Explore all gifts <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-[80px] lg:pt-[96px] pb-[80px] lg:pb-[96px] bg-[#F4F2EA] w-full overflow-hidden">
      <div className="container mx-auto max-w-[1360px] px-0">
        
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[32px] lg:mb-[40px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col text-left">
              <h2 className="font-heading text-[28px] lg:text-[36px] leading-[1.15] text-[#183330] font-medium mb-3 lg:mb-4">
                Need it today? We&apos;ve got you.
              </h2>
              <p className="text-[15px] lg:text-[17px] text-[#5F706C] leading-relaxed max-w-[550px]">
                {selectedLocation 
                  ? `Thoughtful gifts available for same-day delivery in ${selectedLocation}, when the moment can't wait.`
                  : `Thoughtful gifts available for same-day delivery. Select your location to see options.`}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-6 pb-2">
              <Link 
                href="/delivery/same-day" 
                className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-1.5"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Desktop Navigation Arrows */}
              <div className="flex items-center gap-2 border-l border-[#E4E7E2] pl-6">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all" />
                <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all" />
              </div>
            </div>
          </div>

          {/* Carousel Rail */}
          <CarouselContent className="px-4 sm:px-6 lg:px-8 -ml-3 lg:-ml-[16px] pb-4">
            {sameDayProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-3 lg:pl-[16px] basis-auto">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
      </div>
    </section>
  );
}
