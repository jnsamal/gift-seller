export type NavItemType = 'direct' | 'mega-menu' | 'grouped-menu';

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  type: NavItemType;
  columns?: MegaMenuColumn[];
  featured?: {
    title: string;
    image?: string;
    links: NavLink[];
  };
}

export const navigationItems: NavItem[] = [
  {
    label: "Gifts",
    href: "/gifts",
    type: "mega-menu",
    columns: [
      {
        heading: "Shop by Occasion",
        links: [
          { label: "Birthday", href: "/occasion/birthday" },
          { label: "Anniversary", href: "/occasion/anniversary" },
          { label: "Wedding", href: "/occasion/wedding" },
          { label: "Housewarming", href: "/occasion/housewarming" },
          { label: "Congratulations", href: "/occasion/congratulations" },
          { label: "Thank You", href: "/occasion/thank-you" }
        ]
      },
      {
        heading: "Shop by Recipient",
        links: [
          { label: "For Her", href: "/recipient/her" },
          { label: "For Him", href: "/recipient/him" },
          { label: "For Mom", href: "/recipient/mom" },
          { label: "For Dad", href: "/recipient/dad" },
          { label: "For Kids", href: "/recipient/kids" },
          { label: "For Friends", href: "/recipient/friends" }
        ]
      },
      {
        heading: "Shop by Budget",
        links: [
          { label: "Under ₹499", href: "/budget/under-499" },
          { label: "Under ₹999", href: "/budget/under-999" },
          { label: "Under ₹1499", href: "/budget/under-1499" },
          { label: "Premium Gifts", href: "/budget/premium" },
        ]
      }
    ],
    featured: {
      title: "Featured",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
      links: [
        { label: "Personalised Gifts", href: "/personalised" },
        { label: "Same Day Gifts", href: "/delivery/same-day" },
        { label: "New Arrivals", href: "/new-arrivals", badge: "New" }
      ]
    }
  },
  {
    label: "Personalised",
    href: "/personalised",
    type: "mega-menu",
    columns: [
      {
        heading: "Popular Categories",
        links: [
          { label: "Mugs & Drinkware", href: "/personalised/mugs" },
          { label: "Cushions", href: "/personalised/cushions" },
          { label: "Photo Frames", href: "/personalised/frames" },
          { label: "Jewellery", href: "/personalised/jewellery" },
        ]
      },
      {
        heading: "Accessories",
        links: [
          { label: "Wallets & Bags", href: "/personalised/wallets" },
          { label: "Keychains", href: "/personalised/keychains" },
          { label: "Pens & Stationery", href: "/personalised/stationery" },
        ]
      }
    ]
  },
  {
    label: "Birthday",
    href: "/occasion/birthday",
    type: "direct"
  },
  {
    label: "Anniversary",
    href: "/occasion/anniversary",
    type: "direct"
  },
  {
    label: "Flowers",
    href: "/category/flowers",
    type: "mega-menu",
    columns: [
      {
        heading: "By Type",
        links: [
          { label: "Roses", href: "/category/flowers/roses" },
          { label: "Orchids", href: "/category/flowers/orchids" },
          { label: "Lilies", href: "/category/flowers/lilies" },
          { label: "Carnations", href: "/category/flowers/carnations" },
        ]
      },
      {
        heading: "By Arrangement",
        links: [
          { label: "Bouquets", href: "/category/flowers/bouquets" },
          { label: "Glass Vases", href: "/category/flowers/vases" },
          { label: "Flower Boxes", href: "/category/flowers/boxes" },
        ]
      }
    ]
  },
  {
    label: "Cakes",
    href: "/category/cakes",
    type: "direct"
  },
  {
    label: "Hampers",
    href: "/category/hampers",
    type: "direct"
  },
  {
    label: "Plants",
    href: "/category/plants",
    type: "direct"
  },
  {
    label: "Home & Living",
    href: "/category/home",
    type: "direct"
  },
  {
    label: "Same Day",
    href: "/delivery/same-day",
    type: "direct"
  },
  {
    label: "Offers",
    href: "/offers",
    type: "direct"
  },
  {
    label: "Corporate",
    href: "/corporate",
    type: "direct"
  }
];
