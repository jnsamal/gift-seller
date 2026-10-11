export interface Recipient {
  slug: string;
  name: string;
  image: string;
  href: string;
}

export const recipients: Recipient[] = [
  {
    slug: "for-her",
    name: "For Her",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-her"
  },
  {
    slug: "for-him",
    name: "For Him",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-him"
  },
  {
    slug: "for-mom",
    name: "For Mom",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bbc9?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-mom"
  },
  {
    slug: "for-dad",
    name: "For Dad",
    image: "https://images.unsplash.com/photo-1585832770485-e68a5dbcf50d?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-dad"
  },
  {
    slug: "for-wife",
    name: "For Wife",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-wife"
  },
  {
    slug: "for-husband",
    name: "For Husband",
    image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-husband"
  },
  {
    slug: "for-friends",
    name: "For Friends",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-friends"
  },
  {
    slug: "for-kids",
    name: "For Kids",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop",
    href: "/recipient/for-kids"
  }
];
