"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, layout = "carousel" }: { product: Product; layout?: "carousel" | "grid" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link 
      href={product.href}
      className={cn("group flex flex-col shrink-0 snap-start outline-none", layout === "grid" ? "w-full min-w-0" : "w-[76vw] sm:w-[35vw] md:w-[28vw] lg:w-[240px] xl:w-[260px]")}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[10px] bg-[#F4F2EA] mb-4">
        {/* Neutral placeholder on error */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-[#F4F2EA] z-0",
          imgError ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-sm font-medium text-[#5F706C]/50 uppercase tracking-wider text-center px-4">
            Product image unavailable
          </span>
        </div>

        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className={cn(
            "relative z-0 object-cover w-full h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]",
            imgError && "opacity-0"
          )}
        />

        {product.badge && (
          <Badge variant="secondary" className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-[11px] font-bold tracking-wider text-[#183330] rounded-[4px] px-2 py-0.5 hover:bg-white/95">
            {product.badge}
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button 
          variant="ghost"
          size="icon"
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          aria-pressed={isWishlisted}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
        >
          <Heart 
            className={cn(
              "w-[18px] h-[18px] transition-colors", 
              isWishlisted ? "fill-[#D2A01F] text-[#D2A01F]" : "text-[#183330] hover:text-[#D2A01F]"
            )} 
            strokeWidth={isWishlisted ? 0 : 1.5}
          />
        </Button>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col flex-grow">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 text-[12px] text-[#5F706C] mb-1.5">
            <div className="flex items-center text-[#D2A01F]">
              <Star className="w-[14px] h-[14px] fill-current" />
            </div>
            <span className="font-medium text-[#183330]">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-[15px] text-[#183330] font-medium leading-snug line-clamp-2 mb-2 group-hover:text-[#07514D] transition-colors">
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-[15px] font-semibold text-[#183330]">₹{product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[13px] text-[#5F706C] line-through">₹{product.compareAtPrice}</span>
          )}
          {product.discountPercentage && (
            <span className="text-[12px] font-semibold text-[#D2A01F] ml-1">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Personalisation/Delivery Info */}
        {(product.isPersonalised || product.deliveryInfo) && (
          <div className="mt-2.5 flex flex-col gap-1">
            {product.isPersonalised && (
              <span className="text-[12px] font-medium text-[#5F706C] flex items-center gap-1 transition-transform">
                Make it personal <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
            )}
            {product.deliveryInfo && (
              <span className="text-[12px] text-[#07514D] font-medium">
                {product.deliveryInfo}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
