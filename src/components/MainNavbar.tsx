"use client";

import Link from "next/link";
import { Suspense } from "react";
import { MapPin, User, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { NavbarSearch } from "./NavbarSearch";
import { MobileCategoryNavigation } from "./CategoryNavigation";
import { useCart } from "@/components/commerce/CartContext";
import { useAuth } from "@/components/auth/AuthContext";

export function DeliveryLocation() {
  return (
    <button className="hidden lg:flex items-center gap-1.5 hover:text-primary transition-colors text-left group" aria-label="Change delivery location">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
        <MapPin className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-tight">Deliver to</span>
        <span className="text-sm font-medium leading-tight flex items-center gap-1">Bhubaneswar <ChevronDown className="w-3 h-3 opacity-50" /></span>
      </div>
    </button>
  );
}

export function MobileDeliveryLocation() {
  return (
    <button className="flex w-full items-center justify-between py-2.5 px-4 bg-muted/30 border-t border-border text-sm" aria-label="Change delivery location">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Deliver to:</span>
        <span className="font-medium">Bhubaneswar</span>
      </div>
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

export function AccountButton() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Link href={isAuthenticated ? "/account" : "/login"} className="hidden md:flex items-center gap-2 hover:text-primary transition-colors group">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent group-hover:bg-primary/10 transition-colors">
        <User className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium hidden xl:block">
        {isAuthenticated ? "Account" : "Sign In"}
      </span>
    </Link>
  );
}

export function WishlistButton() {
  return (
    <Link href="/account/wishlist" className="hidden md:flex items-center gap-2 hover:text-primary transition-colors group">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent group-hover:bg-primary/10 transition-colors relative">
        <Heart className="w-5 h-5" />
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary text-[9px] text-primary-foreground font-bold border border-background">
          0
        </span>
      </div>
      <span className="text-sm font-medium hidden xl:block">Wishlist</span>
    </Link>
  );
}

export function CartButton() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="flex items-center gap-2 hover:text-primary transition-colors group">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent group-hover:bg-primary/10 transition-colors relative">
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#07514D] text-[10px] text-white font-bold border-2 border-background">
            {cartCount}
          </span>
        )}
      </div>
      <span className="text-sm font-medium hidden xl:block">Cart</span>
    </Link>
  );
}

export function MobileMenuTrigger() {
  return (
    <MobileCategoryNavigation>
      <button className="flex md:hidden h-10 w-10 items-center justify-start hover:text-primary transition-colors" aria-label="Open mobile menu">
        <Menu className="w-6 h-6" />
      </button>
    </MobileCategoryNavigation>
  );
}

export function MainNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm">
      {/* Desktop & Tablet Navigation */}
      <div className="hidden md:flex container mx-auto px-4 h-[72px] lg:h-[80px] items-center gap-6 lg:gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-3xl">
          <Suspense fallback={<div className="h-11 w-full bg-muted/30 animate-pulse rounded-md border border-border" />}>
            <NavbarSearch />
          </Suspense>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2 lg:gap-6 shrink-0">
          <DeliveryLocation />
          <div className="hidden lg:block w-px h-8 bg-border" />
          <div className="flex items-center gap-1 lg:gap-2">
            <AccountButton />
            <WishlistButton />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-col w-full">
        {/* Top Row: Menu, Logo, Cart */}
        <div className="flex items-center justify-between px-4 h-14">
          <MobileMenuTrigger />
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </Link>
          <CartButton />
        </div>
        
        {/* Middle Row: Search */}
        <div className="px-4 pb-3">
          <Suspense fallback={<div className="h-12 w-full bg-muted/30 animate-pulse rounded-md border border-border" />}>
            <NavbarSearch />
          </Suspense>
        </div>

        {/* Bottom Row: Contextual Delivery */}
        <MobileDeliveryLocation />
      </div>
    </header>
  );
}
