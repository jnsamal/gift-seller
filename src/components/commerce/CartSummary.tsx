import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CartSummary as CartSummaryType } from "@/data/cart";
import { ShieldCheck, ArrowRight, X } from "lucide-react";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setAppliedCoupon(couponCode.toUpperCase());
      setIsApplying(false);
      setCouponCode("");
    }, 600);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push("/checkout");
  };

  // Mock calculation if coupon applied
  const currentDiscount = appliedCoupon ? 300 : summary.discount;
  const currentTotal = summary.subtotal - currentDiscount + summary.shipping + summary.tax;

  const isFreeShippingUnlocked = summary.subtotal > 1500;
  const amountToFreeShipping = isFreeShippingUnlocked ? 0 : 1500 - summary.subtotal;

  return (
    <div className="bg-[#FCFAF5] border border-[#E4E7E2] rounded-lg p-5 sm:p-6 lg:p-8">
      <h2 className="text-[18px] font-semibold text-[#183330] mb-6">Order Summary</h2>

      {/* Free Shipping Indicator */}
      {!isFreeShippingUnlocked ? (
        <div className="bg-[#F4F2EA] p-4 rounded-[4px] mb-6 border border-[#E4E7E2]">
          <p className="text-[13px] text-[#183330] font-medium mb-2">
            Add <span className="font-bold">₹{amountToFreeShipping.toLocaleString("en-IN")}</span> more to unlock Free Delivery
          </p>
          <div className="w-full h-1.5 bg-[#E4E7E2] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D2A01F] rounded-full" 
              style={{ width: `${Math.min(100, (summary.subtotal / 1500) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#e2f1ee] p-3 rounded-[4px] mb-6 flex items-center justify-center border border-[#07514D]/20">
          <p className="text-[13px] text-[#07514D] font-semibold uppercase tracking-wider">
            ✓ Free Delivery Unlocked
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="flex flex-col gap-3.5 mb-6">
        <div className="flex justify-between text-[15px] text-[#5F706C]">
          <span>Subtotal</span>
          <span className="font-medium text-[#183330]">₹{summary.subtotal.toLocaleString("en-IN")}</span>
        </div>
        
        {currentDiscount > 0 && (
          <div className="flex justify-between text-[15px] text-[#07514D]">
            <span>Discount</span>
            <span className="font-medium">−₹{currentDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-[15px] text-[#5F706C]">
          <span>Shipping</span>
          <span className="font-medium text-[#183330]">
            {summary.shipping === 0 ? "Calculated at checkout" : `₹${summary.shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      <Separator className="bg-[#E4E7E2] mb-6" />

      {/* Total */}
      <div className="flex justify-between items-end mb-6">
        <span className="text-[16px] font-semibold text-[#183330]">Total</span>
        <div className="flex flex-col items-end">
          <span className="text-[24px] font-semibold text-[#183330] leading-none">
            ₹{currentTotal.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-[#5F706C] mt-1">Inclusive of all taxes</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <Button 
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full h-14 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-[16px] font-semibold transition-colors mb-4 group"
      >
        {isCheckingOut ? (
          "Preparing Secure Checkout..."
        ) : (
          <span className="flex items-center">
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>

      {/* Reassurance */}
      <div className="flex items-center justify-center gap-2 text-[12px] text-[#5F706C] mb-8">
        <ShieldCheck className="w-4 h-4 text-[#07514D]" />
        <span>Secure checkout powered by Gifty</span>
      </div>

      <Separator className="bg-[#E4E7E2] mb-6" />

      {/* Coupon Form */}
      <div>
        <p className="text-[14px] font-medium text-[#183330] mb-3">Gift Card or Discount Code</p>
        
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-[#F4F2EA] border border-[#E4E7E2] rounded-[4px]">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#183330] tracking-wider">{appliedCoupon}</span>
              <span className="text-[11px] bg-[#07514D] text-white px-2 py-0.5 rounded-full">Applied</span>
            </div>
            <button 
              onClick={handleRemoveCoupon}
              className="text-[#5F706C] hover:text-[#183330] transition-colors"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="h-11 bg-white border-[#E4E7E2] focus-visible:ring-1 focus-visible:ring-[#07514D] text-[14px]"
            />
            <Button 
              type="submit" 
              disabled={isApplying || !couponCode.trim()}
              variant="outline"
              className="h-11 px-6 border-[#183330] text-[#183330] hover:bg-[#F4F2EA] font-medium transition-colors disabled:opacity-50"
            >
              {isApplying ? "..." : "Apply"}
            </Button>
          </form>
        )}
      </div>

    </div>
  );
}
