"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/commerce/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function CheckoutOrderSummary({ shippingCost }: { shippingCost: number }) {
  const { items, summary } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    setIsApplying(true);
    setTimeout(() => {
      // Mock validation
      if (couponCode.toUpperCase() === "WELCOME10") {
        setAppliedCoupon({ code: "WELCOME10", discount: Math.floor(summary.subtotal * 0.1) });
      } else {
        setAppliedCoupon(null);
      }
      setIsApplying(false);
      setCouponCode("");
    }, 600);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const finalDiscount = appliedCoupon ? appliedCoupon.discount : summary.discount;
  const finalTotal = summary.subtotal - finalDiscount + shippingCost + summary.tax;

  return (
    <div className="flex flex-col bg-[#F4F2EA] p-6 lg:p-8 rounded-xl border border-[#E4E7E2]">
      <h2 className="font-heading text-[22px] text-[#183330] font-medium mb-6">Order Summary</h2>

      <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 shrink-0 bg-white rounded-md overflow-hidden border border-[#E4E7E2]">
              <Image 
                src={item.product.images?.[0] || item.product.image}
                alt={item.product.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#5F706C] text-white text-[11px] font-medium flex items-center justify-center rounded-full z-10 border-2 border-[#F4F2EA]">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-[#183330] leading-tight mb-1">
                {item.product.title}
              </span>
              {item.personalisation && item.personalisation.length > 0 && (
                <div className="text-[12px] text-[#5F706C] flex flex-col gap-0.5 mb-1">
                  {item.personalisation.map((p, i) => (
                    <span key={i}>{p.label}: {p.value}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-[14px] font-medium text-[#183330] shrink-0">
              {item.product.currency || "₹"}{(item.product.price * item.quantity).toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-[#E4E7E2] mb-6" />

      {/* Coupon Form */}
      <div className="mb-6">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-white border border-[#07514D]/20 rounded-md">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[#07514D] tracking-wide">{appliedCoupon.code}</span>
              <span className="text-[12px] text-[#5F706C]">Discount applied</span>
            </div>
            <button 
              onClick={removeCoupon}
              className="text-[12px] font-medium text-[#5F706C] hover:text-[#183330] underline underline-offset-2 transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-3">
            <Input 
              placeholder="Promo code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] h-11 text-[14px]"
            />
            <Button 
              type="submit" 
              variant="outline" 
              className="h-11 px-6 bg-white border-[#E4E7E2] text-[#183330] hover:bg-[#FCFAF5] transition-colors"
              disabled={isApplying || !couponCode}
            >
              {isApplying ? "Applying" : "Apply"}
            </Button>
          </form>
        )}
      </div>

      <Separator className="bg-[#E4E7E2] mb-6" />

      {/* Price Breakdown */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center text-[14px] text-[#5F706C]">
          <span>Subtotal</span>
          <span className="font-medium text-[#183330]">₹{summary.subtotal.toLocaleString("en-IN")}</span>
        </div>
        
        {finalDiscount > 0 && (
          <div className="flex justify-between items-center text-[14px] text-[#D2A01F]">
            <span>Discount</span>
            <span className="font-medium">−₹{finalDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-[14px] text-[#5F706C]">
          <span>Shipping</span>
          <span className="font-medium text-[#183330]">
            {shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      <Separator className="bg-[#E4E7E2] mb-6" />

      <div className="flex justify-between items-center">
        <span className="text-[16px] font-medium text-[#183330]">Total</span>
        <span className="font-heading text-[24px] font-semibold text-[#183330]">
          ₹{finalTotal.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
