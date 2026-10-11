import Link from 'next/link';
import { Truck, Gift, ShieldCheck, HelpCircle } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 h-10 md:h-9 flex items-center justify-between text-[11px] sm:text-xs font-medium tracking-wide">
        {/* Mobile View */}
        <div className="flex md:hidden w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-secondary" />
            <span>Same Day & Midnight Delivery</span>
          </div>
          <Link href="/faq" className="hover:text-secondary transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>
        </div>

        {/* Desktop / Tablet View */}
        <div className="hidden md:flex w-full items-center justify-between">
          <div className="flex items-center gap-5 lg:gap-6">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Truck className="w-3.5 h-3.5 text-secondary" />
              <span>Same Day & Midnight Delivery</span>
            </div>
            <div className="w-px h-3 bg-primary-foreground/20" />
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Gift className="w-3.5 h-3.5 text-secondary" />
              <span>Personalised Gifts for Every Occasion</span>
            </div>
            <div className="w-px h-3 bg-primary-foreground/20 hidden lg:block" />
            <div className="hidden lg:flex items-center gap-1.5 lg:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Secure Payments</span>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-5">
            <Link href="/track-order" className="hover:text-secondary hover:underline underline-offset-4 transition-all opacity-90 hover:opacity-100">
              Track Order
            </Link>
            <div className="w-px h-3 bg-primary-foreground/20" />
            <Link href="/faq" className="hover:text-secondary hover:underline underline-offset-4 transition-all opacity-90 hover:opacity-100">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
