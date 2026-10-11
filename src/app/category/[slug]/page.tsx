import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { bestSellers } from "@/data/products"; // using bestSellers as mock data for all categories
import { CategoryPage } from "@/components/gifting/CategoryPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const category = categories.find((c) => c.slug === resolvedParams.slug);
  
  if (!category) {
    return { title: "Category Not Found | Gifty" };
  }

  return {
    title: `${category.name} | Gifty`,
    description: `Shop the best ${category.name.toLowerCase()} for your loved ones.`,
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  // Multiply the bestSellers array to simulate a larger catalog (24 items)
  const mockProducts = [...bestSellers, ...bestSellers, ...bestSellers, ...bestSellers].map((p, i) => ({
    ...p,
    id: `${p.id}-${i}`
  }));

  const totalCount = 142; // Mock total count for pagination

  return (
    <CategoryPage 
      category={category} 
      products={mockProducts} 
      totalCount={totalCount} 
    />
  );
}
