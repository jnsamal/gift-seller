"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bestSellers } from "@/data/products";
import { ProductCard } from "@/components/gifting/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function BestSellers() {
  // Graceful empty state
  if (!bestSellers || bestSellers.length === 0) {
    return (
      <section className="pt-[88px] pb-[88px] bg-[#FCFAF5] w-full flex items-center justify-center">
        <p className="text-[#5F706C] text-[14px]">Best sellers are being updated.</p>
      </section>
    );
  }

  return (
    <section className="pt-[88px] lg:pt-[96px] pb-[88px] lg:pb-[96px] bg-[#FCFAF5] w-full overflow-hidden">
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
              <h2 className="font-heading text-[28px] lg:text-[36px] leading-[1.15] text-[#183330] font-medium">
                Our most-loved gifts.
              </h2>
            </div>

            <div className="hidden lg:flex items-center gap-6 pb-2">
              <Link 
                href="/category/best-sellers" 
                className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-1.5"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Desktop Navigation Arrows */}
              <div className="flex items-center gap-2 border-l border-[#E4E7E2] pl-6">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-white text-[#183330] hover:bg-[#F4F2EA] transition-all" />
                <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-white text-[#183330] hover:bg-[#F4F2EA] transition-all" />
              </div>
            </div>
          </div>

          {/* Carousel Rail */}
          <CarouselContent className="px-4 sm:px-6 lg:px-8 -ml-3 lg:-ml-[16px] pb-4">
            {bestSellers.map((product) => (
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
