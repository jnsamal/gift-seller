import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/data/products";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { Footer } from "@/components/gifting/Footer";
import { ProductListing } from "./ProductListing";
import { Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SearchPageProps {
  query: string;
  products: Product[];
  totalCount: number;
}

export function SearchPage({ query, products, totalCount }: SearchPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF5]">
      {/* Shared Header */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <MainNavbar />
        <CategoryNavigation />
      </div>

      <main className="flex-1 w-full pb-[120px]">
        
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6 lg:mb-8">
            <BreadcrumbList className="text-[13px] font-medium text-[#5F706C]">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-[#183330] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#183330] font-semibold">Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Search Header Area */}
          <div className="flex flex-col mb-8 lg:mb-12 max-w-5xl">
            <span className="text-[13px] font-semibold text-[#5F706C] uppercase tracking-widest mb-3">
              Search Results For
            </span>
            <h1 className="font-heading text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] text-[#183330] font-medium mb-4 break-words">
              &quot;{query}&quot;
            </h1>
          </div>

          {/* Product Listing (Toolbar + Filters + Grid) */}
          <Suspense fallback={<div className="w-full h-[60vh] flex items-center justify-center text-[#5F706C]">Loading results...</div>}>
            <ProductListing 
              initialProducts={products}
              totalCount={totalCount}
              searchQuery={query}
            />
          </Suspense>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
