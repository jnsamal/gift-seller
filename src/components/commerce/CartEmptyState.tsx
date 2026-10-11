import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-32 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-[#F4F2EA] flex items-center justify-center mb-8">
        <ShoppingBag className="w-10 h-10 text-[#5F706C] stroke-[1.5]" />
      </div>
      
      <h2 className="font-heading text-[28px] lg:text-[32px] text-[#183330] font-medium mb-3">
        Your cart is empty
      </h2>
      
      <p className="text-[16px] text-[#5F706C] mb-10 max-w-sm">
        Your next thoughtful gift is waiting. Explore our curated collections to find the perfect present.
      </p>
      
      <Link href="/category/all" className="inline-flex items-center justify-center h-14 px-10 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-[16px] font-medium transition-colors mb-12">
        Explore Gifts
      </Link>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-10 border-t border-[#E4E7E2] w-full max-w-lg">
        <span className="text-[13px] font-semibold text-[#183330] uppercase tracking-wider mb-2 sm:mb-0 sm:mr-4">
          Quick Links
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/category/bestsellers" className="text-[14px] text-[#5F706C] hover:text-[#07514D] font-medium transition-colors">
            Best Sellers
          </Link>
          <Link href="/category/personalised-gifts" className="text-[14px] text-[#5F706C] hover:text-[#07514D] font-medium transition-colors">
            Personalised Gifts
          </Link>
          <Link href="/category/occasions" className="text-[14px] text-[#5F706C] hover:text-[#07514D] font-medium transition-colors">
            Shop by Occasion
          </Link>
        </div>
      </div>
    </div>
  );
}
