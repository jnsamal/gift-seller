export interface Product {
  id: string;
  slug?: string;
  title: string;
  image: string;
  images?: string[];
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  isPersonalised?: boolean;
  personalisationOptions?: {
    type: "text" | "photo" | "select";
    label: string;
    required: boolean;
    maxLength?: number;
    options?: string[];
  }[];
  deliveryInfo?: string;
  sameDayAvailable?: boolean;
  specifications?: Record<string, string>;
  stock?: number;
  href: string;
}

export const bestSellers: Product[] = [
  {
    id: "prod-1",
    title: "Personalised Minimalist Photo Frame",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    price: 1299,
    compareAtPrice: 1599,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 142,
    badge: "BESTSELLER",
    isPersonalised: true,
    href: "/product/personalised-photo-frame"
  },
  {
    id: "prod-2",
    title: "Premium Artisan Chocolate Assortment",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800&auto=format&fit=crop",
    price: 899,
    rating: 4.9,
    reviewCount: 324,
    deliveryInfo: "Same-day delivery available",
    href: "/product/artisan-chocolates"
  },
  {
    id: "prod-3",
    title: "Classic Men's Chronograph Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    price: 4999,
    compareAtPrice: 5999,
    discountPercentage: 16,
    badge: "NEW",
    isPersonalised: true,
    href: "/product/mens-watch"
  },
  {
    id: "prod-4",
    title: "Elegant Ceramic Vase & Fresh Lilies",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop",
    price: 2499,
    rating: 4.7,
    reviewCount: 89,
    deliveryInfo: "Delivery by Tomorrow",
    href: "/product/ceramic-vase-lilies"
  },
  {
    id: "prod-5",
    title: "Curated Celebration Gift Hamper",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop",
    price: 3499,
    compareAtPrice: 3999,
    discountPercentage: 12,
    rating: 4.9,
    reviewCount: 215,
    badge: "BESTSELLER",
    href: "/product/celebration-hamper"
  },
  {
    id: "prod-6",
    title: "Gold-Plated Minimalist Necklace",
    image: "https://images.unsplash.com/photo-1599643478514-4a410f05256e?q=80&w=800&auto=format&fit=crop",
    price: 1899,
    rating: 4.6,
    reviewCount: 56,
    isPersonalised: true,
    href: "/product/minimalist-necklace"
  }
];
