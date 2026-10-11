import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/data/categories";
import { Product } from "@/data/products";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { Footer } from "@/components/gifting/Footer";
import { ProductListing } from "./ProductListing";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CategoryPageProps {
  category: Category;
  products: Product[];
  totalCount: number;
}

export function CategoryPage({ category, products, totalCount }: CategoryPageProps) {
  // Generate some quick links based on category name for demonstration
  const quickLinks = [
    `Personalised ${category.name}`,
    `${category.name} Hampers`,
    `${category.name} for Her`,
    `${category.name} for Him`,
    `Under ₹999`,
    `Same-Day Delivery`,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF5]">
      {/* Shared Header */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <MainNavbar />
        <CategoryNavigation />
      </div>

      <main className="flex-1 w-full pb-[120px]">
        {/* Category Header Area */}
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          
          {/* 1. Breadcrumb */}
          <Breadcrumb className="mb-6 lg:mb-8">
            <BreadcrumbList className="text-[13px] font-medium text-[#5F706C]">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-[#183330] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/category/all" className="hover:text-[#183330] transition-colors">Gifts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#183330] font-semibold">{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* 2. Category Intro */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center mb-8 lg:mb-12 max-w-5xl">
            <div className="flex-1 flex flex-col">
              <h1 className="font-heading text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] text-[#183330] font-medium mb-4">
                Thoughtful gifts for {category.name.toLowerCase()}
              </h1>
              <p className="text-[15px] lg:text-[17px] text-[#5F706C] leading-relaxed max-w-2xl">
                Discover personalised gifts, hampers, keepsakes, and more for making their {category.name.toLowerCase()} memorable. 
                Carefully curated to help you celebrate beautifully.
              </p>
            </div>
            {/* Optional Intro Image */}
            {category.image && (
              <div className="hidden md:block shrink-0 w-[240px] lg:w-[280px] aspect-[4/3] rounded-lg overflow-hidden bg-[#E4E7E2]">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* 3. Category Quick Links */}
          <div className="flex overflow-x-auto pb-4 mb-4 lg:mb-8 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2.5 lg:gap-3 min-w-max">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={`#`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-[#E4E7E2] rounded-full text-[13px] font-medium text-[#183330] bg-white hover:border-[#183330] hover:bg-[#F4F2EA] transition-colors whitespace-nowrap"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Product Listing (Toolbar + Filters + Grid) */}
          <Suspense fallback={<div className="w-full h-[60vh] flex items-center justify-center">Loading products...</div>}>
            <ProductListing 
              initialProducts={products}
              totalCount={totalCount}
            />
          </Suspense>

        </div>

        {/* 14. SEO Content */}
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-24 lg:mt-32">
          <div className="max-w-3xl mx-auto flex flex-col gap-5 text-center">
            <h2 className="font-heading text-[24px] lg:text-[28px] text-[#183330] font-medium">
              {category.name} They&apos;ll Remember
            </h2>
            <p className="text-[14px] lg:text-[15px] text-[#5F706C] leading-relaxed">
              Finding the perfect {category.name.toLowerCase()} doesn&apos;t have to be difficult. Whether you are looking for something deeply personal, elegantly curated, or beautifully simple, our collection is designed to help you express your exact sentiments. 
            </p>
            <p className="text-[14px] lg:text-[15px] text-[#5F706C] leading-relaxed">
              Every item is thoughtfully sourced and meticulously packaged, ensuring the unboxing experience is as delightful as the gift itself. Explore our bestsellers, fresh arrivals, and exclusive hampers tailored specifically for this occasion.
            </p>
            <button className="text-[13px] font-semibold text-[#183330] uppercase tracking-wider hover:text-[#D2A01F] underline underline-offset-4 mt-2 transition-colors">
              Read more
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
