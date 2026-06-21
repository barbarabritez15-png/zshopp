// Shared domain types for Z Shop (used by API routes and frontend).

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  isFeatured: boolean;
  isDeal: boolean;
  category: Category;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ProductDetail {
  product: Product;
  reviews: Review[];
  related: Product[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentLast4: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}
