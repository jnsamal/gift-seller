"use client";

import { useState } from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { occasions, Occasion } from "@/data/occasions";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function OccasionCard({ occasion }: { occasion: Occasion }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <Link 
      href={occasion.href}
      className="group relative flex flex-col w-[76vw] sm:w-[35vw] md:w-[28vw] lg:w-[240px] xl:w-[260px] aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-[12px] bg-[#F4F2EA] shrink-0 snap-start outline-none"
    >
      {/* Neutral placeholder on error */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-[#F4F2EA] z-0",
        imgError ? "opacity-100" : "opacity-0"
      )}>
        <span className="text-sm font-medium text-[#5F706C]/50 tracking-wider uppercase text-center px-4">
          {occasion.name}
        </span>
      </div>

      <img 
        src={occasion.image} 
        alt={`Premium gifting collection for ${occasion.name}`}
        loading="lazy"
        onError={() => setImgError(true)}
        className={cn(
          "relative z-0 object-cover w-full h-full transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
          imgError && "opacity-0"
        )}
      />
      
      {/* Readability gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-10 opacity-90" />
      
      {/* Text Content */}
      <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col p-5 lg:p-6">
        <h3 className="font-heading text-[18px] lg:text-[21px] text-white font-medium drop-shadow-sm mb-1.5 lg:mb-2">
          {occasion.name}
        </h3>
        
        <span className="text-[12px] lg:text-[13px] text-white/95 font-medium group-hover:text-[#D2A01F] transition-colors flex items-center gap-1.5">
          Shop gifts <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
        </span>
      </div>
    </Link>
  );
}

export function ShopByOccasion() {
  return (
    <section className="pt-[64px] lg:pt-[96px] pb-[64px] lg:pb-[96px] bg-[#FCFAF5] w-full overflow-hidden">
      <div className="container mx-auto max-w-[1360px] px-0">
        
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[32px] lg:mb-[48px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col text-left">
              <h2 className="font-heading text-[32px] lg:text-[42px] xl:text-[48px] leading-[1.15] text-[#183330] font-medium mb-3 max-w-2xl">
                Gifts for every reason to celebrate.
              </h2>
              <p className="text-[14px] lg:text-[16px] text-[#5F706C] leading-relaxed max-w-[620px]">
                From birthdays and anniversaries to new beginnings and everyday moments, find something made for the occasion.
              </p>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2 pb-2">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] hover:border-[#F4F2EA] transition-all bg-transparent" />
              <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] hover:border-[#F4F2EA] transition-all bg-transparent" />
            </div>
          </div>

          {/* Carousel Rail */}
          <CarouselContent className="px-4 sm:px-6 lg:px-8 -ml-3 lg:-ml-[16px] pb-4">
            {occasions.map((occasion) => (
              <CarouselItem key={occasion.slug} className="pl-3 lg:pl-[16px] basis-auto">
                <OccasionCard occasion={occasion} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
      </div>
    </section>
  );
}
