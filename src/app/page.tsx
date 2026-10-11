"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search, MapPin, ShoppingBag, User, ArrowRight, Calendar, Star, Sparkles, Truck, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { DeliveryIntent } from "@/components/DeliveryIntent";
import { ShopByOccasion } from "@/components/gifting/ShopByOccasion";
import { ShopByRecipient } from "@/components/gifting/ShopByRecipient";
import { PopularCategories } from "@/components/gifting/PopularCategories";
import { PromotionalCollections } from "@/components/gifting/PromotionalCollections";
import { BestSellers } from "@/components/gifting/BestSellers";
import { PersonalisedGifts } from "@/components/gifting/PersonalisedGifts";
import { SameDayGifts } from "@/components/gifting/SameDayGifts";
import { GiftFinder } from "@/components/gifting/GiftFinder";
import { GiftInspiration } from "@/components/gifting/GiftInspiration";
import { CustomerReviews } from "@/components/gifting/CustomerReviews";
import { CorporateGifting } from "@/components/gifting/CorporateGifting";
import { Newsletter } from "@/components/gifting/Newsletter";
import { Footer } from "@/components/gifting/Footer";



const TRENDING = [
  { id: 1, title: "Personalized Name Necklace", price: "₹1,299", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop", badge: "Bestseller" },
  { id: 2, title: "Midnight Rose Bouquet", price: "₹899", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop", badge: "Same Day" },
  { id: 3, title: "Engraved Leather Wallet", price: "₹1,499", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop", badge: "Personalized" },
  { id: 4, title: "Artisan Chocolate Box", price: "₹699", image: "https://images.unsplash.com/photo-1540816912389-9a2df41e06f5?q=80&w=600&auto=format&fit=crop", badge: "New" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <MainNavbar />
      <CategoryNavigation />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full h-[calc(100dvh-140px)] lg:h-[calc(100vh-164px)] min-h-[550px] overflow-hidden flex items-center">
          
          {/* BACKGROUND VISUAL */}
          <div className="absolute inset-0 w-full h-full z-0">
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <img 
                src="/herobg.png" 
                alt="Beautiful premium Indian gifts" 
                className="w-full h-full object-cover object-[60%_50%] md:object-center"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-black/30 md:bg-black/20 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/40 md:via-black/40 to-transparent" />
            </motion.div>
          </div>

          {/* CONTENT */}
          <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 z-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col max-w-xl md:max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="h-[1px] w-6 md:w-8 bg-secondary" />
                <span className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase drop-shadow-sm">Made for the moment</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-5 md:mb-6 font-medium drop-shadow-md leading-[1.1]">
                Thoughtful gifts,<br/>
                <span className="text-secondary italic">made personal.</span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 md:mb-10 max-w-[95%] drop-shadow-md">
                Personalised gifts, curated for birthdays, anniversaries, celebrations and the moments worth remembering.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button size="lg" className="rounded-[4px] bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base font-medium px-8 md:px-10 h-12 md:h-14 w-full sm:w-auto shadow-none transition-all">
                  Shop Personalised Gifts
                </Button>
                <Button size="lg" variant="outline" className="rounded-[4px] text-white border-white hover:bg-white hover:text-primary text-sm md:text-base font-medium px-8 h-12 md:h-14 w-full sm:w-auto transition-all backdrop-blur-sm bg-black/10">
                  Explore All Gifts
                </Button>
              </div>

              {/* Delivery Hint */}
              <div className="mt-10 md:mt-12 flex items-center gap-3 text-xs md:text-sm text-white/80 pt-5 md:pt-6">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-secondary flex items-center justify-center shadow-sm ring-2 ring-black/20 text-white">
                    <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </div>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary flex items-center justify-center shadow-sm ring-2 ring-black/20 text-white">
                    <Gift className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </div>
                </div>
                <span className="drop-shadow-sm font-medium">Same-day premium delivery in select cities.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* DELIVERY INTENT SECTION */}
        <DeliveryIntent />

        <ShopByOccasion />
        <ShopByRecipient />
        <PopularCategories />
        <PromotionalCollections />
        <BestSellers />
        <PersonalisedGifts />
        <SameDayGifts />
        <GiftFinder />
        <GiftInspiration />
        <CustomerReviews />
        <CorporateGifting />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
