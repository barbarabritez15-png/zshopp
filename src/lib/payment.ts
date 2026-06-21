// Mock payment processor for Z Shop.
// Validates card numbers (Luhn), expiry, and CVC, then simulates an
// authorization with a short delay. No real card data leaves the server.

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  last4: string;
  error?: string;
}

export interface ProcessPaymentInput {
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
  name: string;
}

export function luhnValid(num: string): boolean {
  const s = num.replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(s)) return false;
  let sum = 0;
  let dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string): string {
  const s = num.replace(/\s+/g, "");
  if (/^4/.test(s)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(s)) return "Mastercard";
  if (/^3[47]/.test(s)) return "Amex";
  if (/^6(?:011|5)/.test(s)) return "Discover";
  return "Card";
}

export async function processPayment(
  input: ProcessPaymentInput
): Promise<PaymentResult> {
  // Simulate network + authorization latency.
  await new Promise((r) => setTimeout(r, 1400));

  const num = input.cardNumber.replace(/\s+/g, "");
  if (!luhnValid(num)) {
    return {
      success: false,
      transactionId: "",
      last4: "",
      error: "Your card number is invalid. Please check and try again.",
    };
  }

  const m = input.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m) {
    return {
      success: false,
      transactionId: "",
      last4: num.slice(-4),
      error: "Invalid expiry date.",
    };
  }
  const mm = parseInt(m[1], 10);
  const yy = parseInt(m[2], 10);
  if (mm < 1 || mm > 12) {
    return {
      success: false,
      transactionId: "",
      last4: num.slice(-4),
      error: "Invalid expiry month.",
    };
  }
  const now = new Date();
  // Expiry is end of the given month.
  const exp = new Date(2000 + yy, mm, 1, 0, 0, 0);
  if (exp <= new Date(now.getFullYear(), now.getMonth(), 1)) {
    return {
      success: false,
      transactionId: "",
      last4: num.slice(-4),
      error: "Your card has expired.",
    };
  }

  if (!/^\d{3,4}$/.test(input.cvc)) {
    return {
      success: false,
      transactionId: "",
      last4: num.slice(-4),
      error: "Invalid security code.",
    };
  }

  // Decline sentinel: any number ending in 0000 is "declined" for demoing.
  if (num.endsWith("0000")) {
    return {
      success: false,
      transactionId: "",
      last4: num.slice(-4),
      error: "Your card was declined. Please try a different card.",
    };
  }

  const txId = "txn_" + Math.random().toString(36).slice(2, 14);
  return { success: true, transactionId: txId, last4: num.slice(-4) };
}
