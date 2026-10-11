"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { giftGuides, GiftGuide } from "@/data/giftGuides";

import { cn } from "@/lib/utils";

function GuideCard({ guide, featured, className }: { guide: GiftGuide, featured?: boolean, className?: string }) {
  return (
    <article className={cn("group flex flex-col gap-5 w-full", className)}>
      <Link href={guide.href} className={cn(
        "overflow-hidden bg-[#E4E7E2] rounded-sm block relative w-full",
        featured ? "aspect-[3/4] lg:aspect-[4/5]" : "aspect-[3/4]"
      )}>
        <img 
          src={guide.image} 
          alt={guide.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </Link>
      
      <div className="flex flex-col text-left pt-2 lg:pt-4">
        <span className="text-[11px] font-bold tracking-[0.15em] text-[#5F706C] uppercase mb-3">
          {guide.category}
        </span>
        
        <Link href={guide.href} className="group-hover:text-[#07514D] transition-colors">
          <h3 className={cn(
            "font-heading leading-[1.15] text-[#183330] font-medium mb-3",
            featured ? "text-[26px] lg:text-[32px]" : "text-[20px] lg:text-[24px]"
          )}>
            {guide.title}
          </h3>
        </Link>
        
        <p className="text-[14px] lg:text-[15px] text-[#5F706C] leading-relaxed mb-5 line-clamp-3 lg:line-clamp-2 max-w-[95%]">
          {guide.excerpt || "Discover beautiful ways to celebrate your most important moments with thoughtfully selected gifts."}
        </p>
        
        <Link 
          href={guide.href}
          className="inline-flex items-center text-[12px] font-semibold text-[#183330] uppercase tracking-[0.05em] hover:text-[#D2A01F] transition-colors w-fit"
        >
          Read article <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-[300ms] group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function GiftInspiration() {
  // Use first 3 guides for the 3-column stagger
  const guides = giftGuides.slice(0, 3);

  return (
    <section className="pt-[88px] lg:pt-[112px] pb-[88px] lg:pb-[140px] bg-[#FCFAF5] w-full">
      <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[48px] lg:mb-[64px]">
          <div className="flex flex-col text-left">
            <span className="text-[11px] lg:text-[12px] font-medium tracking-[0.14em] text-[#5F706C] uppercase mb-3">
              The Journal
            </span>
            <h2 className="font-heading text-[32px] lg:text-[48px] leading-[1.15] text-[#183330] font-medium">
              Ideas for gifting beautifully.
            </h2>
          </div>

          <div className="hidden lg:flex items-center pb-2">
            <Link 
              href="/blog" 
              className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-1.5 border-b border-[#183330] hover:border-[#D2A01F] pb-0.5"
            >
              Read all articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Editorial Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[32px] lg:gap-[48px] items-start">
          
          <div className="md:mt-[48px] lg:mt-[80px]">
            <GuideCard guide={guides[1]} />
          </div>

          <div className="md:mt-0">
            <GuideCard guide={guides[0]} featured />
          </div>

          <div className="md:mt-[96px] lg:mt-[160px]">
            <GuideCard guide={guides[2]} />
          </div>

        </div>

        {/* Mobile View All */}
        <div className="mt-12 flex lg:hidden items-center justify-center border-t border-[#E4E7E2] pt-8">
          <Link 
            href="/blog" 
            className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-1.5"
          >
            Read all articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
