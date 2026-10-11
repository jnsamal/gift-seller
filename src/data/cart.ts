import { Product, bestSellers } from "./products";

export interface CartPersonalisation {
  label: string;
  value: string;
}

export interface CartItem {
  id: string; // Unique cart line item ID
  productId: string;
  product: Product;
  quantity: number;
  personalisation?: CartPersonalisation[];
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// MOCK DATA
export const mockCart: Cart = {
  items: [
    {
      id: "line-1",
      productId: "prod-1",
      product: bestSellers.find(p => p.id === "prod-1")!,
      quantity: 1,
      personalisation: [
        { label: "Name Engraving", value: "Rahul" },
        { label: "Size", value: "Medium" }
      ]
    },
    {
      id: "line-2",
      productId: "prod-4",
      product: bestSellers.find(p => p.id === "prod-4")!,
      quantity: 2,
    }
  ],
  summary: {
    subtotal: 6297, // 1299 + (2499 * 2)
    discount: 0,
    shipping: 0, // Free
    tax: 0, // Included
    total: 6297
  }
};
