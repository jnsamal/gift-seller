"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { bestSellers } from "@/data/products";
import { useCart } from "./CartContext";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { Footer } from "@/components/gifting/Footer";
import { ProductCard } from "@/components/gifting/ProductCard";

import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartEmptyState } from "./CartEmptyState";

export function CartPage() {
  const { items, cartCount, summary, updateQuantity, removeItem } = useCart();

  // Recommendations: exclude items already in cart
  const cartProductIds = items.map(i => i.productId);
  const recommendations = bestSellers
    .filter(p => !cartProductIds.includes(p.id))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF5]">
      {/* Shared Header */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <MainNavbar />
        <CategoryNavigation />
      </div>

      <main className="flex-1 w-full pb-20 lg:pb-[120px]">
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="flex flex-col">
              
              {/* Cart Header */}
              <div className="flex items-end justify-between mb-8 lg:mb-10 pb-6 border-b border-[#E4E7E2]">
                <div>
                  <h1 className="font-heading text-[32px] md:text-[40px] leading-[1.1] text-[#183330] font-medium mb-2">
                    Your Cart
                  </h1>
                  <span className="text-[15px] text-[#5F706C]">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <Link 
                  href="/category/all" 
                  className="hidden sm:flex items-center text-[14px] font-medium text-[#5F706C] hover:text-[#07514D] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </div>

              {/* Main Layout: 2 Columns */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full">
                
                {/* Left: Cart Items (~65%) */}
                <div className="w-full lg:flex-1 min-w-0 flex flex-col">
                  {items.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}

                  {/* Mobile Continue Shopping */}
                  <div className="mt-8 sm:hidden">
                    <Link 
                      href="/category/all" 
                      className="flex items-center justify-center text-[14px] font-medium text-[#5F706C] hover:text-[#07514D] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Right: Order Summary (~35%) */}
                <aside className="w-full lg:w-[35%] shrink-0 lg:sticky lg:top-[180px]">
                  <CartSummary summary={summary} />
                </aside>

              </div>
            </div>
          )}

          {/* Recommendations Rail */}
          {recommendations.length > 0 && items.length > 0 && (
            <div className="mt-24 lg:mt-32 pt-16 border-t border-[#E4E7E2]">
              <h3 className="font-heading text-[24px] lg:text-[28px] text-[#183330] font-medium mb-8">
                Complete the Gift
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {recommendations.map(product => (
                  <ProductCard key={product.id} product={product} layout="grid" />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
