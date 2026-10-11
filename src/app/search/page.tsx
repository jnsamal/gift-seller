import { bestSellers } from "@/data/products";
import { SearchPage } from "@/components/gifting/SearchPage";
import { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Search Results | Gifty",
  description: "Find the perfect gift for every occasion.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q || "";
  const query = rawQuery.toLowerCase();

  // Mock search execution logic over the bestSellers array
  // In a real application, this would be an API call matching against an index
  let results = bestSellers;
  
  if (query) {
    results = bestSellers.filter(product => {
      // Basic text matching against title and mock categories for demo
      return (
        product.title.toLowerCase().includes(query) ||
        (query.includes("personal") && product.isPersonalised) ||
        (query.includes("hamper") && product.title.toLowerCase().includes("hamper")) ||
        (query.includes("flower") && product.title.toLowerCase().includes("lilies"))
      );
    });
  }

  // To simulate a large result set for pagination, mock-multiply the results
  // If no results matched, the array is naturally empty.
  const mockProducts = results.length > 0 
    ? [...results, ...results, ...results].map((p, i) => ({ ...p, id: `${p.id}-s${i}` }))
    : [];

  const totalCount = mockProducts.length * 3; // Mocking a total count > loaded count

  return (
    <SearchPage 
      query={rawQuery} 
      products={mockProducts} 
      totalCount={query && mockProducts.length === 0 ? 0 : totalCount} 
    />
  );
}
