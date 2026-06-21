"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  items: CartLine[];
  addItem: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
}

const MAX_QTY = 99;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (line, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === line.productId);
          if (existing) {
            const max = line.stock > 0 ? line.stock : MAX_QTY;
            return {
              items: s.items.map((i) =>
                i.productId === line.productId
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + qty, max),
                      price: line.price,
                      name: line.name,
                      image: line.image,
                      stock: line.stock,
                    }
                  : i
              ),
            };
          }
          return { items: [...s.items, { ...line, quantity: qty }] };
        }),
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => {
              if (i.productId !== productId) return i;
              const max = i.stock > 0 ? i.stock : MAX_QTY;
              return { ...i, quantity: Math.max(0, Math.min(qty, max)) };
            })
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "zshop-cart-v1" }
  )
);

export function cartCount(items: CartLine[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartSubtotal(items: CartLine[]): number {
  return +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
}
