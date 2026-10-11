"use client";

import { Star } from "lucide-react";
import { mockReviews, Review } from "@/data/reviews";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col p-[24px] lg:p-[32px] bg-[#FCFAF5] border border-[#E4E7E2] rounded-[10px] lg:rounded-[12px] w-[84vw] sm:w-[350px] lg:w-[420px] shrink-0 snap-start transition-colors duration-300 hover:border-[#C4C7C2] text-left">
      
      {/* Accessible Rating */}
      <div 
        className="flex items-center gap-1 mb-5" 
        aria-label={`${review.rating} out of 5 stars`}
        role="img"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-[14px] h-[14px]", 
              i < review.rating ? "fill-[#D2A01F] text-[#D2A01F]" : "fill-[#E4E7E2] text-[#E4E7E2]"
            )} 
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-[16px] lg:text-[17px] text-[#183330] leading-relaxed mb-6 flex-grow font-serif italic">
        &quot;{review.text}&quot;
      </p>

      {/* Customer Metadata */}
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-[#183330]">
            {review.customerName}
          </span>
          {review.verified && (
            <>
              <span className="text-[#E4E7E2] text-[10px]">●</span>
              <span className="text-[12px] text-[#5F706C]">Verified purchase</span>
            </>
          )}
        </div>
        
        {review.productName && (
          <span className="text-[13px] text-[#07514D] font-medium tracking-wide">
            {review.productName}
          </span>
        )}
      </div>

    </div>
  );
}

export function CustomerReviews() {
  if (!mockReviews || mockReviews.length === 0) {
    return null; // Gracefully hide section if no reviews exist, as per spec
  }

  return (
    <section className="pt-[88px] lg:pt-[112px] pb-[88px] lg:pb-[112px] bg-[#F4F2EA] w-full overflow-hidden">
      <div className="container mx-auto max-w-[1360px] px-0">
        
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[40px] lg:mb-[56px] px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col text-left">
              <h2 className="font-heading text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.15] text-[#183330] font-medium">
                Loved by people who love to give.
              </h2>
            </div>

            {/* Desktop Navigation Arrows & Aggregate Optional Summary */}
            <div className="hidden lg:flex items-center gap-6 pb-2">
              
              {/* Optional Aggregate Summary */}
              <div className="flex flex-col text-right">
                <span className="text-[15px] font-semibold text-[#183330] flex items-center justify-end gap-1.5">
                  <Star className="w-4 h-4 fill-[#D2A01F] text-[#D2A01F]" /> 4.9 / 5
                </span>
                <span className="text-[13px] text-[#5F706C]">Based on 1,240 reviews</span>
              </div>

              <div className="flex items-center gap-2 border-l border-[#E4E7E2] pl-6">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-white text-[#183330] hover:bg-[#FCFAF5] transition-all" />
                <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-[#E4E7E2] bg-white text-[#183330] hover:bg-[#FCFAF5] transition-all" />
              </div>
            </div>

          </div>

          {/* Review Rail */}
          <CarouselContent className="px-4 sm:px-6 lg:px-8 -ml-3 lg:-ml-[16px] pb-4 items-stretch">
            {mockReviews.map((review) => (
              <CarouselItem key={review.id} className="pl-3 lg:pl-[16px] basis-auto flex">
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
      </div>
    </section>
  );
}
