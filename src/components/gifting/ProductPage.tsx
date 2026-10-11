import { ChevronRight } from "lucide-react";
import { Product } from "@/data/products";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { Footer } from "@/components/gifting/Footer";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductCard } from "./ProductCard";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductPage({ product, relatedProducts }: ProductPageProps) {
  // Use images array if provided, fallback to the single cover image.
  const galleryImages = product.images?.length ? product.images : [product.image, product.image, product.image]; // Duplicated for mock purposes if array is missing

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF5]">
      {/* Shared Header */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <MainNavbar />
        <CategoryNavigation />
      </div>

      <main className="flex-1 w-full pb-[120px]">
        
        {/* Main Product Section */}
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
          
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6 lg:mb-8">
            <BreadcrumbList className="text-[13px] font-medium text-[#5F706C] flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap">
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink href="/" className="hover:text-[#183330] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink href="/category/all" className="hover:text-[#183330] transition-colors">Gifts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="truncate min-w-0">
                <BreadcrumbPage className="text-[#183330] font-semibold truncate">{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20 items-start">
            
            {/* LEFT: Product Gallery (approx 55%) */}
            <div className="w-full lg:w-[55%] xl:w-[60%] shrink-0">
              <ProductGallery images={galleryImages} altText={product.title} />
            </div>

            {/* RIGHT: Product Information (approx 45%) */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col pt-4 lg:pt-0">
              <ProductInfo product={product} />
            </div>

          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 lg:mt-32">
            <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 lg:mb-10">
                <h2 className="font-heading text-[28px] lg:text-[36px] leading-[1.15] text-[#183330] font-medium">
                  You may also like
                </h2>
              </div>
              
              <div className="flex overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory pb-4">
                <div className="flex gap-4 md:gap-6 min-w-max">
                  {relatedProducts.slice(0, 6).map((rp, idx) => (
                    <ProductCard key={`${rp.id}-${idx}`} product={rp} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
