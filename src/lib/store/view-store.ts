"use client";

import { create } from "zustand";

export type View =
  | { name: "home" }
  | { name: "all" }
  | { name: "deals" }
  | { name: "featured" }
  | { name: "category"; slug: string; categoryName?: string }
  | { name: "product"; slug: string }
  | { name: "search"; q: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "orders" }
  | { name: "order-confirmation"; orderNumber: string };

interface ViewStore {
  view: View;
  go: (v: View) => void;
}

export const useView = create<ViewStore>((set) => ({
  view: { name: "home" },
  go: (v) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    set({ view: v });
  },
}));
