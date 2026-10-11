"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const corporateGiftingData = {
  eyebrow: "CORPORATE GIFTING",
  title: "Gifts that represent your brand.",
  description: "Thoughtfully curated corporate gifts for clients, employees, teams and important business moments.",
  image: "https://images.unsplash.com/photo-1585832770485-e68a5dbcf50d?q=80&w=1600&auto=format&fit=crop",
  primaryCta: {
    label: "Request a Quote",
    href: "/corporate/request-quote"
  },
  secondaryCta: {
    label: "Explore Corporate Gifting",
    href: "/corporate"
  },
  benefits: "Client Gifts  ·  Employee Gifting  ·  Festive Orders  ·  Custom Branding"
};

export function CorporateGifting() {
  return (
    <section className="bg-[#043F3C] w-full overflow-hidden text-[#FCFAF5]">
      {/* 
        Using padding here ensures the deep teal background 
        flows perfectly without breaking section margins. 
      */}
      <div className="py-[88px] lg:py-[120px] container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] lg:gap-[64px] xl:gap-[96px]">
          
          {/* Content Area (45% desktop, order 2 on mobile) */}
          <div className="order-2 lg:order-1 w-full lg:w-[45%] flex flex-col text-left">
            <span className="text-[11px] lg:text-[12px] font-medium tracking-[0.14em] text-[#D2A01F] uppercase mb-4 lg:mb-6">
              {corporateGiftingData.eyebrow}
            </span>
            
            <h2 className="font-heading text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[52px] leading-[1.12] text-[#FCFAF5] font-medium mb-4 lg:mb-6 max-w-[500px]">
              {corporateGiftingData.title}
            </h2>
            
            <p className="text-[15px] lg:text-[17px] text-[#FCFAF5]/80 leading-relaxed max-w-[480px] mb-8 lg:mb-10">
              {corporateGiftingData.description}
            </p>
            
            <div className="flex flex-col gap-6 lg:gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link href={corporateGiftingData.primaryCta.href} className={cn(buttonVariants({ variant: "default" }), "group h-[48px] lg:h-[50px] px-6 lg:px-8 rounded-[8px] font-semibold text-[14px] lg:text-[15px] w-full sm:w-fit bg-[#D2A01F] text-[#043F3C] hover:bg-[#A87908] border-transparent")}>
                  {corporateGiftingData.primaryCta.label} 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-[3px]" />
                </Link>

                <Link href={corporateGiftingData.secondaryCta.href} className={cn(buttonVariants({ variant: "link" }), "group p-0 h-auto font-medium text-[14px] text-[#FCFAF5] hover:text-[#D2A01F] hover:no-underline w-fit")}>
                  {corporateGiftingData.secondaryCta.label} 
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
                </Link>
              </div>

              {/* Inline Benefits Line */}
              <div className="pt-2 sm:pt-0">
                <span className="text-[13px] lg:text-[14px] text-[#FCFAF5]/60 tracking-wide font-medium">
                  {corporateGiftingData.benefits}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Image Area (55% desktop, order 1 on mobile) */}
          <div className="order-1 lg:order-2 w-full lg:w-[55%] h-[280px] sm:h-[360px] lg:h-[540px] xl:h-[640px] rounded-[10px] lg:rounded-[14px] overflow-hidden group">
            <img 
              src={corporateGiftingData.image} 
              alt="Premium corporate gift boxes arranged on a contemporary office table"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
