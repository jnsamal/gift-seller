export interface Review {
  id: string;
  rating: number;
  text: string;
  customerName: string;
  verified: boolean;
  productName?: string;
  productSlug?: string;
  image?: string;
}

// Development placeholder data. 
// Replace with real backend data in production.
export const mockReviews: Review[] = [
  {
    id: "rev-1",
    rating: 5,
    text: "The personalised frame arrived beautifully packed and looked even better than I expected.",
    customerName: "Priya S.",
    verified: true,
    productName: "Personalised Photo Frame"
  },
  {
    id: "rev-2",
    rating: 5,
    text: "Such a thoughtful selection of gifts. The delivery was exactly on time for my parents' anniversary.",
    customerName: "Rahul K.",
    verified: true,
    productName: "Curated Celebration Hamper"
  },
  {
    id: "rev-3",
    rating: 4,
    text: "Beautifully crafted ceramic vase. The packaging was extremely secure, making it perfect for gifting.",
    customerName: "Anjali M.",
    verified: true,
    productName: "Elegant Ceramic Vase"
  },
  {
    id: "rev-4",
    rating: 5,
    text: "The artisan chocolates were a huge hit. Absolutely premium quality from start to finish.",
    customerName: "Vikram D.",
    verified: true,
    productName: "Premium Artisan Chocolate Box"
  },
  {
    id: "rev-5",
    rating: 5,
    text: "I loved the elegant ribbon and keepsake box. It felt incredibly special to open.",
    customerName: "Neha T.",
    verified: true,
    productName: "Signature White Keepsake Box"
  }
];
