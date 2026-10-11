"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { recipients, Recipient } from "@/data/recipients";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function RecipientCard({ recipient }: { recipient: Recipient }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <Link 
      href={recipient.href}
      className="group flex flex-col items-center w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] shrink-0 snap-start outline-none"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-full bg-[#FCFAF5] mb-4 lg:mb-5 border border-[#E4E7E2] transition-colors group-hover:border-[#D2A01F]">
        {/* Neutral placeholder on error */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-[#FCFAF5] z-0",
          imgError ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-[10px] font-medium text-[#5F706C]/50 tracking-wider uppercase text-center px-4">
            {recipient.name}
          </span>
        </div>

        <img 
          src={recipient.image} 
          alt={`Thoughtful gifting for ${recipient.name}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className={cn(
            "relative z-0 object-cover w-full h-full transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
            imgError && "opacity-0"
          )}
        />
      </div>
      
      <h3 className="font-heading text-[16px] lg:text-[18px] text-[#183330] font-medium text-center transition-colors group-hover:text-[#D2A01F]">
        {recipient.name}
      </h3>
    </Link>
  );
}

export function ShopByRecipient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="pt-[48px] lg:pt-[64px] pb-[48px] lg:pb-[64px] bg-[#FCFAF5] w-full overflow-hidden">
      <div className="container mx-auto max-w-[1360px] px-0">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[32px] lg:mb-[48px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col text-left">
            <h2 className="font-heading text-[32px] lg:text-[36px] xl:text-[40px] leading-[1.15] text-[#183330] font-medium max-w-2xl">
              Find something they&apos;ll love.
            </h2>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:flex items-center gap-2 pb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all"
              aria-label="Previous recipients"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border-[#E4E7E2] bg-[#FCFAF5] text-[#183330] hover:bg-white transition-all"
              aria-label="Next recipients"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel Rail */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 lg:gap-[16px] px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recipients.map((recipient) => (
            <OccasionCard key={recipient.slug} recipient={recipient} />
          ))}
        </div>
        
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}

// Ensure alias is correct internally for the map function
const OccasionCard = RecipientCard;
