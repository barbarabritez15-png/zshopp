// Shipping & tax calculation for Z Shop.

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FLAT = 5.99;
export const TAX_RATE = 0.08; // 8% sales tax

export interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingRemaining: number;
}

export function computeTotals(subtotal: number): Totals {
  const sub = +subtotal.toFixed(2);
  const shipping =
    sub === 0 || sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = +(sub * TAX_RATE).toFixed(2);
  const total = +(sub + shipping + tax).toFixed(2);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);
  return { subtotal: sub, shipping, tax, total, freeShippingRemaining };
}
