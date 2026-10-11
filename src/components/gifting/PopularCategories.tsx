"use client";

import { useState } from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, Category } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function CategoryCard({ category }: { category: Category }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <Link 
      href={category.href}
      className="group flex flex-col w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] shrink-0 snap-start outline-none"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[8px] bg-[#F4F2EA] mb-3">
        {/* Neutral placeholder on error */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-[#F4F2EA] z-0",
          imgError ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-[11px] font-medium text-[#5F706C]/50 tracking-wider uppercase text-center px-4">
            {category.name}
          </span>
        </div>

        <img 
          src={category.image} 
          alt={`${category.name} product collection`}
          loading="lazy"
          onError={() => setImgError(true)}
          className={cn(
            "relative z-0 object-cover w-full h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]",
            imgError && "opacity-0"
          )}
        />
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        <h3 className="font-medium text-[15px] lg:text-[16px] text-[#183330] mb-0.5 group-hover:text-[#D2A01F] transition-colors">
          {category.name}
        </h3>
        <span className="text-[12px] text-[#5F706C] flex items-center gap-1 transition-transform">
          Shop collection <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function PopularCategories() {
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[32px] lg:mb-[40px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col text-left">
              <h2 className="font-heading text-[28px] lg:text-[36px] leading-[1.15] text-[#183330] font-medium max-w-2xl">
                Explore our collections.
              </h2>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2 pb-2">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all" />
              <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all" />
            </div>
          </div>

          {/* Carousel Rail */}
          <CarouselContent className="px-4 sm:px-6 lg:px-8 -ml-3 lg:-ml-[16px] pb-4">
            {categories.map((category) => (
              <CarouselItem key={category.slug} className="pl-3 lg:pl-[16px] basis-auto">
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
      </div>
    </section>
  );
}
