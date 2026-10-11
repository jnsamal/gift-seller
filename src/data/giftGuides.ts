export interface GiftGuide {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  href: string;
  featured: boolean;
}

export const giftGuides: GiftGuide[] = [
  {
    id: "guide-1",
    slug: "first-birthday-gift-guide",
    category: "BIRTHDAY GIFT GUIDE",
    title: "Planning a first birthday gift they'll actually remember",
    excerpt: "A practical guide to choosing something thoughtful, personal and genuinely useful.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1200&auto=format&fit=crop",
    href: "/blog/first-birthday-gift-guide",
    featured: true
  },
  {
    id: "guide-2",
    slug: "personalised-gifts-they-will-keep",
    category: "PERSONALISED",
    title: "Personalised gifts they'll actually keep",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop",
    href: "/blog/personalised-gifts-they-will-keep",
    featured: false
  },
  {
    id: "guide-3",
    slug: "housewarming-gift-guide",
    category: "HOUSEWARMING",
    title: "How to choose a thoughtful housewarming gift",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop",
    href: "/blog/housewarming-gift-guide",
    featured: false
  }
];
