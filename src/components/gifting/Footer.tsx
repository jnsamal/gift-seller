"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ShieldCheck, Truck, Gift, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const footerGroups: FooterGroup[] = [
  {
    title: "SHOP",
    links: [
      { label: "All Gifts", href: "/gifts" },
      { label: "Personalised Gifts", href: "/personalised" },
      { label: "Best Sellers", href: "/category/best-sellers" },
      { label: "New Arrivals", href: "/category/new-arrivals" },
      { label: "Gift Hampers", href: "/category/gift-hampers" },
      { label: "Flowers", href: "/category/flowers" },
      { label: "Cakes", href: "/category/cakes" },
      { label: "Home & Living", href: "/category/home-living" },
      { label: "Same-Day Gifts", href: "/delivery/same-day" },
    ]
  },
  {
    title: "GIFT BY",
    links: [
      { label: "Birthday", href: "/occasion/birthday" },
      { label: "Anniversary", href: "/occasion/anniversary" },
      { label: "Wedding", href: "/occasion/wedding" },
      { label: "Housewarming", href: "/occasion/housewarming" },
      { label: "Congratulations", href: "/occasion/congratulations" },
      { label: "Thank You", href: "/occasion/thank-you" },
      { label: "For Her", href: "/recipient/her" },
      { label: "For Him", href: "/recipient/him" },
      { label: "For Kids", href: "/recipient/kids" },
    ]
  },
  {
    title: "HELP & SUPPORT",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Delivery Information", href: "/delivery-information" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Returns & Refunds", href: "/refund-policy" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ]
  },
  {
    title: "ABOUT GIFT T SELLER",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Corporate Gifting", href: "/corporate" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Gift Finder", href: "/gift-finder" },
      { label: "Blog / Gift Inspiration", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ]
  }
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Safe and trusted checkout"
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "Delivery options across India"
  },
  {
    icon: Gift,
    title: "Personalised Gifting",
    description: "Make your gift uniquely theirs"
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "We're here when you need us"
  }
];

function MobileAccordionItem({ group }: { group: FooterGroup }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-[#FCFAF5]/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-[18px] text-left font-medium text-[14px] text-[#FCFAF5] outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm"
      >
        <span className="tracking-[0.05em]">{group.title}</span>
        {isOpen ? <Minus className="w-[18px] h-[18px] text-[#FCFAF5]/60" /> : <Plus className="w-[18px] h-[18px] text-[#FCFAF5]/60" />}
      </button>
      <div 
        className={cn(
          "grid transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100 mb-5" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden flex flex-col gap-3.5">
          {group.links.map(link => (
             <Link 
                key={link.label} 
                href={link.href} 
                className="text-[15px] text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors py-0.5"
             >
               {link.label}
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#043F3C] text-[#FCFAF5] w-full pt-[64px] lg:pt-[80px]">
      <nav aria-label="Footer navigation" className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        
        {/* Layer 1: Main Footer Navigation */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_repeat(4,1fr)] gap-[48px] lg:gap-[32px] mb-[48px] lg:mb-[64px]">
          
          {/* Brand Block */}
          <div className="flex flex-col max-w-[320px]">
            {/* Minimal Logo Treatment */}
            <Link href="/" className="inline-flex items-center gap-2 mb-6 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm w-fit">
              <Gift className="w-7 h-7 text-[#D2A01F]" />
              <span className="font-heading text-[22px] font-semibold tracking-tight text-[#FCFAF5]">giftT seller</span>
            </Link>
            
            <p className="text-[18px] lg:text-[20px] font-medium text-[#FCFAF5] mb-4 font-heading leading-snug">
              Thoughtful gifts,<br />made personal.
            </p>
            <p className="text-[14px] lg:text-[15px] text-[#FCFAF5]/70 leading-relaxed">
              Personalised gifts and thoughtful finds for birthdays, anniversaries, celebrations and every meaningful moment.
            </p>
          </div>

          {/* Desktop Navigation Columns */}
          {footerGroups.map((group) => (
            <div key={group.title} className="hidden lg:flex flex-col">
              <h3 className="text-[12px] font-medium tracking-[0.14em] uppercase text-[#FCFAF5] mb-6">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-[14px] lg:text-[15px] text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mobile Navigation Accordions */}
          <div className="flex flex-col lg:hidden w-full border-t border-[#FCFAF5]/10">
            {footerGroups.map((group) => (
              <MobileAccordionItem key={group.title} group={group} />
            ))}
          </div>
        </div>

        {/* Layer 2: Trust / Service Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-[32px] lg:py-[40px] border-t border-b border-[#FCFAF5]/10">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4">
                <div className="w-[40px] h-[40px] rounded-full border border-[#FCFAF5]/20 flex items-center justify-center shrink-0 text-[#D2A01F]">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-[#FCFAF5] mb-0.5">
                    {item.title}
                  </span>
                  <span className="text-[13px] text-[#FCFAF5]/60">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 3 & 4: Social / Payment / Bottom Utility Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-[24px] lg:py-[28px]">
          
          <div className="order-3 lg:order-1 flex flex-col sm:flex-row items-center gap-4 text-[13px] text-[#FCFAF5]/60">
            <span>&copy; 2026 giftT seller. All rights reserved.</span>
          </div>

          <div className="order-1 lg:order-2 flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16.11 7.66v.01"/><circle cx="12" cy="12" r="4"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><path d="M5 12h14"></path></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[#FCFAF5]/70 hover:text-[#D2A01F] transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#D2A01F] rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>

          <div className="order-2 lg:order-3 flex flex-col lg:flex-row items-center gap-4 lg:gap-8 w-full lg:w-auto">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[13px] font-medium text-[#FCFAF5]/70 w-full lg:w-auto">
              <Link href="/privacy" className="hover:text-[#D2A01F] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#D2A01F] transition-colors">Terms &amp; Conditions</Link>
              <Link href="/shipping-policy" className="hover:text-[#D2A01F] transition-colors">Shipping</Link>
              <Link href="/refund-policy" className="hover:text-[#D2A01F] transition-colors">Refunds</Link>
            </div>
            
            <div className="hidden lg:block w-[1px] h-[14px] bg-[#FCFAF5]/20" />
            
            <div className="flex items-center gap-2 text-[13px] text-[#FCFAF5]/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D2A01F]" strokeWidth={1.5} />
              Secure payments
            </div>
          </div>

        </div>

      </nav>
    </footer>
  );
}
