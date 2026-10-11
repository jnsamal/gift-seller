"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockCart, CartItem as CartItemType, CartSummary as CartSummaryType } from "@/data/cart";

interface CartContextType {
  items: CartItemType[];
  cartCount: number;
  summary: CartSummaryType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  addItem: (item: CartItemType) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize with mock data for demonstration
  const [items, setItems] = useState<CartItemType[]>(mockCart.items);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const summary = React.useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const discount = 0; // Fixed for mock
    const shipping = subtotal > 1500 ? 0 : 99;
    return {
      subtotal,
      discount,
      shipping,
      tax: 0,
      total: subtotal - discount + shipping,
    };
  }, [items]);

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => 
      prev.map((item) => item.id === id ? { ...item, quantity } : item)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const addItem = (newItem: CartItemType) => {
    setItems((prev) => {
      // Check if exact same item exists
      const existing = prev.find(item => {
        if (item.productId !== newItem.productId) return false;
        const currentPers = JSON.stringify(item.personalisation || []);
        const newPers = JSON.stringify(newItem.personalisation || []);
        return currentPers === newPers;
      });

      if (existing) {
        return prev.map(item => 
          item.id === existing.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  return (
    <CartContext.Provider value={{ items, cartCount, summary, updateQuantity, removeItem, clearCart, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
