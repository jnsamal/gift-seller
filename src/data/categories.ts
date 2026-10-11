export interface Category {
  slug: string;
  name: string;
  image: string;
  href: string;
}

export const categories: Category[] = [
  {
    slug: "personalised-gifts",
    name: "Personalised Gifts",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop",
    href: "/category/personalised-gifts"
  },
  {
    slug: "gift-hampers",
    name: "Gift Hampers",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=600&auto=format&fit=crop",
    href: "/category/gift-hampers"
  },
  {
    slug: "flowers",
    name: "Flowers",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop",
    href: "/category/flowers"
  },
  {
    slug: "cakes",
    name: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    href: "/category/cakes"
  },
  {
    slug: "home-living",
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=600&auto=format&fit=crop",
    href: "/category/home-living"
  },
  {
    slug: "chocolates",
    name: "Chocolates",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=600&auto=format&fit=crop",
    href: "/category/chocolates"
  },
  {
    slug: "plants",
    name: "Plants",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop",
    href: "/category/plants"
  },
  {
    slug: "keepsakes",
    name: "Keepsakes",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop",
    href: "/category/keepsakes"
  }
];
