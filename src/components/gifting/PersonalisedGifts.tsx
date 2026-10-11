"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const content = {
  eyebrow: "PERSONALISE IT",
  title: "Make it unmistakably theirs.",
  description: "Add a name, photo or meaningful message to turn an everyday gift into something they'll remember.",
  image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
  primaryCta: {
    label: "Explore Personalised Gifts",
    href: "/personalised"
  },
  secondaryCta: {
    label: "See how personalisation works",
    href: "/personalised/how-it-works"
  },
  benefits: "Names  ·  Photos  ·  Messages"
};

export function PersonalisedGifts() {
  return (
    <section className="bg-[#F4F2EA] w-full overflow-hidden">
      {/* 
        We use padding here instead of margins to ensure background colors 
        don't break at section boundaries. The vertical spacing is carefully
        calibrated.
      */}
      <div className="py-[64px] lg:py-[120px] container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[32px] lg:gap-[64px] xl:gap-[96px]">
          
          {/* Content Area (40% desktop, order 2 on mobile) */}
          <div className="order-2 lg:order-1 w-full lg:w-[45%] xl:w-[40%] flex flex-col text-left">
            <span className="text-[11px] lg:text-[12px] font-medium tracking-[0.14em] text-[#5F706C] uppercase mb-4 lg:mb-6">
              {content.eyebrow}
            </span>
            
            <h2 className="font-heading text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[54px] leading-[1.12] text-[#183330] font-medium mb-4 lg:mb-6 max-w-[480px]">
              {content.title}
            </h2>
            
            <p className="text-[15px] lg:text-[17px] text-[#5F706C] leading-relaxed max-w-[480px] mb-8 lg:mb-10">
              {content.description}
            </p>
            
            <div className="flex flex-col gap-6">
              <Link 
                href={content.primaryCta.href}
                className="group flex items-center justify-center bg-[#07514D] text-[#FCFAF5] h-[44px] lg:h-[48px] px-6 lg:px-8 rounded-[8px] font-medium text-[14px] lg:text-[15px] w-full sm:w-fit transition-colors hover:bg-[#043F3C]"
              >
                {content.primaryCta.label} 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>

              <div className="flex flex-col gap-3">
                <Link 
                  href={content.secondaryCta.href}
                  className="group text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-1.5 w-fit"
                >
                  {content.secondaryCta.label} 
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
                </Link>
                
                <span className="text-[13px] text-[#5F706C] tracking-wide mt-1">
                  {content.benefits}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Image Area (60% desktop, order 1 on mobile) */}
          <div className="order-1 lg:order-2 w-full lg:w-[55%] xl:w-[60%] h-[280px] sm:h-[360px] lg:h-[640px] xl:h-[720px] rounded-[10px] lg:rounded-[14px] overflow-hidden group">
            <img 
              src={content.image} 
              alt="Personalised gift box with photo frame and engraved keepsake"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
