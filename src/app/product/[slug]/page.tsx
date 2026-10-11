import { notFound } from "next/navigation";
import { bestSellers, type Product } from "@/data/products";
import { ProductPage } from "@/components/gifting/ProductPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  // Match slug from href, since bestSellers use href like `/product/[slug]`
  const product = bestSellers.find((p) => p.href === `/product/${resolvedParams.slug}`);
  
  if (!product) {
    return { title: "Product Not Found | Gifty" };
  }

  return {
    title: `${product.title} | Gifty`,
    description: product.description || `Shop ${product.title} at Gifty.`,
  };
}

export async function generateStaticParams() {
  return bestSellers.map((product) => ({
    slug: product.href.replace("/product/", ""),
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const product = bestSellers.find((p) => p.href === `/product/${resolvedParams.slug}`);

  if (!product) {
    notFound();
  }

  // Inject some mock detailed data so the UI can demonstrate advanced capabilities
  const detailedProduct: Product = {
    ...product,
    description: "Thoughtfully designed to create a lasting impression. This premium gift is meticulously crafted using high-quality materials to ensure it stands the test of time. Every detail is considered, making it the perfect choice for your most special occasions.",
    images: [
      product.image,
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop", // Mock alternative angles
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
    ],
    sameDayAvailable: true,
    currency: "₹",
    stock: 25,
    personalisationOptions: product.isPersonalised ? [
      {
        type: "text",
        label: "Name or Initials",
        required: true,
        maxLength: 15
      },
      {
        type: "text",
        label: "Gift Message",
        required: false,
        maxLength: 120
      },
      {
        type: "photo",
        label: "Reference Photo (Optional)",
        required: false
      }
    ] : undefined,
    specifications: {
      "Material": "Premium finished materials",
      "Dimensions": "25cm x 15cm x 10cm",
      "Weight": "450g",
      "Packaging": "Luxury gift box with satin ribbon"
    }
  };

  const relatedProducts = bestSellers.filter(p => p.id !== product.id);

  return (
    <ProductPage 
      product={detailedProduct} 
      relatedProducts={relatedProducts} 
    />
  );
}
