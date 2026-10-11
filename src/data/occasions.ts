export interface Occasion {
  slug: string;
  name: string;
  image: string;
  href: string;
}

export const occasions: Occasion[] = [
  {
    slug: "birthday",
    name: "Birthday",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/birthday"
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/anniversary"
  },
  {
    slug: "wedding",
    name: "Wedding",
    image: "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/wedding"
  },
  {
    slug: "housewarming",
    name: "Housewarming",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/housewarming"
  },
  {
    slug: "congratulations",
    name: "Congratulations",
    image: "https://images.unsplash.com/photo-1578985824584-c8c7f965d1d6?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/congratulations"
  },
  {
    slug: "thank-you",
    name: "Thank You",
    image: "https://images.unsplash.com/photo-1544252518-e7e781ce3fdf?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/thank-you"
  },
  {
    slug: "baby-new-beginnings",
    name: "Baby & New Beginnings",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/baby"
  },
  {
    slug: "festivals",
    name: "Festivals",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop",
    href: "/occasion/festivals"
  }
];
