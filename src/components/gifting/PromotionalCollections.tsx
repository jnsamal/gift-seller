"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { campaigns, Campaign } from "@/data/campaigns";
import { cn } from "@/lib/utils";

function CampaignCard({ campaign, featured }: { campaign: Campaign, featured?: boolean }) {
  return (
    <Link href={campaign.href} className="group flex flex-col w-full h-full">
      <div className={cn(
        "w-full overflow-hidden bg-[#F4F2EA] rounded-sm",
        featured ? "aspect-[4/3] lg:aspect-[4/3]" : "aspect-[4/3] lg:aspect-[16/10]"
      )}>
        <img 
          src={campaign.image} 
          alt={campaign.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.02]"
        />
      </div>
      
      <div className={cn(
        "flex flex-col flex-grow",
        featured ? "pt-6 lg:pt-8" : "pt-5 lg:pt-6"
      )}>
        <span className="text-[11px] lg:text-[12px] font-bold tracking-[0.15em] text-[#5F706C] uppercase mb-2 lg:mb-3">
          {campaign.eyebrow}
        </span>
        
        <h3 className={cn(
          "font-heading font-medium text-[#183330] leading-[1.15] mb-2 lg:mb-3 transition-colors group-hover:text-[#07514D]",
          featured ? "text-[28px] lg:text-[40px]" : "text-[20px] lg:text-[26px]"
        )}>
          {campaign.title}
        </h3>
        
        <p className={cn(
          "text-[#5F706C] leading-relaxed mb-5",
          featured ? "text-[15px] lg:text-[17px] max-w-[90%]" : "text-[14px] lg:text-[15px] max-w-[95%]"
        )}>
          {campaign.description}
        </p>
        
        <span className={cn(
          "font-medium text-[#183330] uppercase tracking-[0.05em] group-hover:text-[#D2A01F] transition-colors flex items-center gap-1.5 mt-auto",
          featured ? "text-[13px]" : "text-[12px]"
        )}>
          {campaign.ctaLabel} <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function PromotionalCollections() {
  // Graceful fallback if campaigns aren't loaded or fewer than 3
  if (!campaigns || campaigns.length < 3) return null;

  return (
    <section className="pt-[88px] pb-[88px] bg-[#FCFAF5] w-full overflow-hidden border-t border-[#E4E7E2]">
      <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col text-left mb-[48px] lg:mb-[64px]">
          <h2 className="font-heading text-[32px] lg:text-[42px] leading-[1.15] text-[#183330] font-medium">
            Curated gifts worth discovering.
          </h2>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[48px] lg:gap-[80px] items-start">
          
          {/* Featured Campaign (Left Column) */}
          <div className="lg:col-span-7">
            <CampaignCard campaign={campaigns[0]} featured />
          </div>
          
          {/* Supporting Campaigns (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-[40px] lg:gap-[48px]">
            <CampaignCard campaign={campaigns[1]} />
            
            <hr className="border-t border-[#E4E7E2]" />

            <CampaignCard campaign={campaigns[2]} />
          </div>

        </div>
        
      </div>
    </section>
  );
}
