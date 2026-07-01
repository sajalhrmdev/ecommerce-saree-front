export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
  phone?: string;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt?: number;
  images: string[];
  category: Category;
  categoryId: string;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  material?: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress?: string;
  phone?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}
