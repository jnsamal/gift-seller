export interface Campaign {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaLabel: string;
  featured?: boolean;
}

export const campaigns: Campaign[] = [
  {
    slug: "personalised",
    eyebrow: "MAKE IT THEIRS",
    title: "Thoughtful gifts, made personal.",
    description: "Turn a meaningful moment into something they'll keep.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1600&auto=format&fit=crop",
    href: "/personalised",
    ctaLabel: "Shop Personalised Gifts",
    featured: true
  },
  {
    slug: "same-day",
    eyebrow: "NEED IT TODAY?",
    title: "Thoughtful, even at the last minute.",
    description: "Discover gifts available for fast local delivery.",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop",
    href: "/delivery/same-day",
    ctaLabel: "Shop Same-Day Gifts"
  },
  {
    slug: "gift-hampers",
    eyebrow: "CURATED TO IMPRESS",
    title: "A little more to unwrap.",
    description: "Premium hampers thoughtfully put together for every occasion.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1000&auto=format&fit=crop",
    href: "/category/gift-hampers",
    ctaLabel: "Shop Gift Hampers"
  }
];
