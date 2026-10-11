"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface ProductListingProps {
  initialProducts: Product[];
  totalCount: number;
  searchQuery?: string;
}

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "bestselling", label: "Bestselling" },
];

const PRICE_RANGES = [
  { id: "under-499", label: "Under ₹499" },
  { id: "500-999", label: "₹500 – ₹999" },
  { id: "1000-2499", label: "₹1,000 – ₹2,499" },
  { id: "2500-plus", label: "₹2,500+" },
];

const RECIPIENTS = [
  { id: "her", label: "For Her" },
  { id: "him", label: "For Him" },
  { id: "mom", label: "For Mom" },
  { id: "dad", label: "For Dad" },
  { id: "wife", label: "For Wife" },
  { id: "husband", label: "For Husband" },
  { id: "friends", label: "For Friends" },
  { id: "kids", label: "For Kids" },
];

const DELIVERY = [
  { id: "same-day", label: "Same Day" },
  { id: "next-day", label: "Next Day" },
  { id: "scheduled", label: "Scheduled" },
];

// --- Product Listing Component ---
export function ProductListing({ initialProducts, totalCount, searchQuery }: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state
  const [isPending, setIsPending] = useState(false);
  
  // Create a new URLSearchParams object when updating
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleQueryArray = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.get(name)?.split(",") || [];
      
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }

      if (newValues.length > 0) {
        params.set(name, newValues.join(","));
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    setIsPending(true);
    router.push(`${pathname}?${createQueryString("sort", value)}`, { scroll: false });
  };

  const handleFilterToggle = (category: string, value: string) => {
    setIsPending(true);
    router.push(`${pathname}?${toggleQueryArray(category, value)}`, { scroll: false });
  };

  const handleRadioFilter = (category: string, value: string) => {
    setIsPending(true);
    router.push(`${pathname}?${createQueryString(category, value)}`, { scroll: false });
  };

  const clearFilters = () => {
    setIsPending(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price");
    params.delete("recipient");
    params.delete("personalised");
    params.delete("delivery");
    params.delete("rating");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Mock loading effect when params change
  useEffect(() => {
    const timer = setTimeout(() => setIsPending(false), 400);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Derived state from URL
  const currentSort = searchParams.get("sort") || "recommended";
  const selectedPrices = searchParams.get("price")?.split(",") || [];
  const selectedRecipients = searchParams.get("recipient")?.split(",") || [];
  const selectedDelivery = searchParams.get("delivery")?.split(",") || [];
  const selectedPersonalised = searchParams.get("personalised") || "all";

  // Check if any filters are active
  const hasActiveFilters = selectedPrices.length > 0 || selectedRecipients.length > 0 || selectedDelivery.length > 0 || selectedPersonalised !== "all";

  const filterContent = (
    <div className="flex flex-col gap-6 w-full">
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E7E2]">
          <span className="text-[14px] font-medium text-[#183330]">Filters Applied</span>
          <button 
            onClick={clearFilters}
            className="text-[12px] font-medium text-[#5F706C] hover:text-[#07514D] underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <Accordion defaultValue={["price", "recipient", "personalised", "delivery"]} className="w-full">
        
        {/* Price Filter */}
        <AccordionItem value="price" className="border-b border-[#E4E7E2] py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Price
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-3.5">
              {PRICE_RANGES.map((range) => (
                <div key={range.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`price-${range.id}`} 
                    checked={selectedPrices.includes(range.id)}
                    onCheckedChange={() => handleFilterToggle("price", range.id)}
                    className="border-[#5F706C] data-[state=checked]:bg-[#07514D] data-[state=checked]:border-[#07514D] rounded-[4px]"
                  />
                  <Label htmlFor={`price-${range.id}`} className="text-[14px] font-normal text-[#183330] cursor-pointer">
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recipient Filter */}
        <AccordionItem value="recipient" className="border-b border-[#E4E7E2] py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Recipient
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-3.5">
              {RECIPIENTS.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`rec-${rec.id}`} 
                    checked={selectedRecipients.includes(rec.id)}
                    onCheckedChange={() => handleFilterToggle("recipient", rec.id)}
                    className="border-[#5F706C] data-[state=checked]:bg-[#07514D] data-[state=checked]:border-[#07514D] rounded-[4px]"
                  />
                  <Label htmlFor={`rec-${rec.id}`} className="text-[14px] font-normal text-[#183330] cursor-pointer">
                    {rec.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Personalisation Filter (Radio) */}
        <AccordionItem value="personalised" className="border-b border-[#E4E7E2] py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Personalisation
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <RadioGroup 
              value={selectedPersonalised} 
              onValueChange={(val) => handleRadioFilter("personalised", val)}
              className="flex flex-col gap-3.5"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="all" id="pers-all" className="border-[#5F706C] text-[#07514D]" />
                <Label htmlFor="pers-all" className="text-[14px] font-normal text-[#183330] cursor-pointer">All Gifts</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="true" id="pers-true" className="border-[#5F706C] text-[#07514D]" />
                <Label htmlFor="pers-true" className="text-[14px] font-normal text-[#183330] cursor-pointer">Personalised Only</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="false" id="pers-false" className="border-[#5F706C] text-[#07514D]" />
                <Label htmlFor="pers-false" className="text-[14px] font-normal text-[#183330] cursor-pointer">Non-Personalised</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Delivery Filter */}
        <AccordionItem value="delivery" className="border-b-0 py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Delivery
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-3.5">
              {DELIVERY.map((del) => (
                <div key={del.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`del-${del.id}`} 
                    checked={selectedDelivery.includes(del.id)}
                    onCheckedChange={() => handleFilterToggle("delivery", del.id)}
                    className="border-[#5F706C] data-[state=checked]:bg-[#07514D] data-[state=checked]:border-[#07514D] rounded-[4px]"
                  />
                  <Label htmlFor={`del-${del.id}`} className="text-[14px] font-normal text-[#183330] cursor-pointer">
                    {del.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="w-full flex flex-col">
      
      {/* Product Toolbar */}
      <div className="flex items-center justify-between py-4 border-y border-[#E4E7E2] mb-8 lg:mb-10 bg-[#FCFAF5] sticky top-0 z-30 lg:relative lg:top-auto lg:z-auto">
        
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger render={
              <Button variant="outline" size="sm" className="h-10 px-4 rounded-md border-[#E4E7E2] text-[#183330] font-medium flex items-center gap-2" />
            }>
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#D2A01F]" />
                )}
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[380px] bg-[#FCFAF5] p-0 border-r-[#E4E7E2] flex flex-col">
              <SheetHeader className="p-5 border-b border-[#E4E7E2] text-left">
                <SheetTitle className="font-heading text-[22px] font-medium text-[#183330]">Filter Products</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5">
                {filterContent}
              </div>
              <div className="p-5 border-t border-[#E4E7E2] mt-auto bg-[#F4F2EA]">
                <Button className="w-full bg-[#07514D] hover:bg-[#043F3C] text-[#FCFAF5] rounded-md h-12 text-[15px] font-medium">
                  Show {totalCount} Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Label */}
        <div className="hidden lg:flex items-center gap-2 w-[240px] xl:w-[280px] shrink-0">
          <SlidersHorizontal className="w-[18px] h-[18px] text-[#183330]" />
          <span className="text-[15px] font-medium text-[#183330]">Filters</span>
        </div>

        {/* Center Item Count */}
        <div className="text-[14px] lg:text-[15px] font-medium text-[#5F706C] flex-1 text-center lg:text-left">
          {totalCount} gifts
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block text-[14px] text-[#5F706C] font-medium">Sort by:</span>
          <Select value={currentSort} onValueChange={(val) => val && handleSortChange(val)}>
            <SelectTrigger className="w-[140px] md:w-[180px] h-10 border-none bg-transparent shadow-none focus:ring-0 p-0 justify-end gap-1.5 text-[14px] md:text-[15px] font-medium text-[#183330]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent align="end" className="bg-[#FCFAF5] border-[#E4E7E2] rounded-md shadow-lg min-w-[200px]">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="text-[14px] py-2.5 cursor-pointer focus:bg-[#F4F2EA] focus:text-[#07514D]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 w-full items-start">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[240px] xl:w-[280px] shrink-0 sticky top-12">
          {filterContent}
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 w-full">
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="hidden lg:flex flex-wrap items-center gap-2 mb-6">
              {[...selectedPrices, ...selectedRecipients, ...selectedDelivery].map(filter => (
                <div key={filter} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F2EA] border border-[#E4E7E2] rounded-full text-[13px] font-medium text-[#183330]">
                  {filter}
                  <button 
                    onClick={() => {
                      if (PRICE_RANGES.find(p => p.id === filter)) handleFilterToggle("price", filter);
                      else if (RECIPIENTS.find(r => r.id === filter)) handleFilterToggle("recipient", filter);
                      else handleFilterToggle("delivery", filter);
                    }}
                    className="text-[#5F706C] hover:text-[#183330] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedPersonalised !== "all" && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F2EA] border border-[#E4E7E2] rounded-full text-[13px] font-medium text-[#183330]">
                  {selectedPersonalised === "true" ? "Personalised" : "Non-Personalised"}
                  <button 
                    onClick={() => handleRadioFilter("personalised", "all")}
                    className="text-[#5F706C] hover:text-[#183330] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <button 
                onClick={clearFilters}
                className="text-[13px] font-medium text-[#5F706C] hover:text-[#07514D] underline underline-offset-2 ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid Container */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 w-full">
            {isPending ? (
              // Loading State Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))
            ) : initialProducts.length > 0 ? (
              initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))
            ) : (
              <div className="col-span-2 md:col-span-3 xl:col-span-4 flex flex-col items-center justify-center py-16 lg:py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F4F2EA] flex items-center justify-center mb-6">
                  <SlidersHorizontal className="w-8 h-8 text-[#5F706C]" />
                </div>
                <h3 className="font-heading text-[24px] lg:text-[28px] text-[#183330] font-medium mb-3">
                  {searchQuery ? `No gifts found for "${searchQuery}"` : "No gifts found"}
                </h3>
                <p className="text-[15px] text-[#5F706C] max-w-md mb-8">
                  {searchQuery 
                    ? "Try checking your spelling, use more general terms, or explore some of our popular gifting categories."
                    : "Try adjusting your filters or explore more gifting options to find the perfect present."}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="h-12 px-6 rounded-md border-[#183330] text-[#183330] hover:bg-[#F4F2EA] font-medium"
                  >
                    Clear Filters
                  </Button>
                  <Link
                    href="/category/all"
                    className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-[#07514D] hover:bg-[#043F3C] text-[#FCFAF5] font-medium transition-colors"
                  >
                    Browse All Gifts
                  </Link>
                </div>

                {searchQuery && (
                  <div className="flex flex-col items-center border-t border-[#E4E7E2] pt-10 w-full max-w-xl">
                    <h4 className="text-[14px] font-semibold text-[#183330] uppercase tracking-wider mb-6">Popular Searches</h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["Birthday Gifts", "Personalised Gifts", "Gift Hampers", "Flowers", "Gifts for Her", "Same-Day Gifts"].map((term) => (
                        <a 
                          key={term}
                          href={`/search?q=${encodeURIComponent(term)}`}
                          className="px-4 py-2 bg-white border border-[#E4E7E2] rounded-full text-[13px] font-medium text-[#183330] hover:border-[#183330] transition-colors"
                        >
                          {term}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Load More Pagination */}
          {initialProducts.length > 0 && initialProducts.length < totalCount && (
            <div className="w-full flex justify-center mt-16 lg:mt-24 border-t border-[#E4E7E2] pt-12">
              <div className="flex flex-col items-center">
                <span className="text-[14px] text-[#5F706C] font-medium mb-4">
                  Showing {initialProducts.length} of {totalCount} gifts
                </span>
                <Button 
                  variant="outline" 
                  className="h-12 px-8 rounded-md border-[#E4E7E2] bg-white text-[#183330] hover:border-[#183330] hover:bg-white font-medium text-[15px] transition-all min-w-[200px]"
                >
                  Load More
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
