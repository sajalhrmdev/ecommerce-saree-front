"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, Lock } from "lucide-react";
import { API_BASE } from "@/lib/constants";

interface CartItem {
  id: string;
  productId: string;
  product: { id: string; name: string; price: number; slug: string; images: string[]; stock: number };
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data?.items || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (quantity < 1) return;
    await fetch(`${API_BASE}/api/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/api/cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center premium-card p-12 max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-gold-300 mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-3">Your Cart</h1>
          <p className="text-gray-500 mb-8">Please login to view your cart</p>
          <Link href="/login" className="gold-btn inline-block">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-32 text-center">
      <div className="w-10 h-10 border-4 border-gold-300 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  return (
    <div className="bg-cream/30 min-h-screen">
      <div className="bg-white border-b border-gold-200/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="font-serif text-4xl font-bold">Shopping Cart</h1>
          <div className="premium-divider mt-4" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20 premium-card p-12">
            <ShoppingBag className="w-20 h-20 mx-auto text-gold-200 mb-6" />
            <h2 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Explore our exquisite collection and find your perfect saree.</p>
            <Link href="/products" className="gold-btn inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="premium-card p-5 flex gap-5 group">
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="112px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-3xl text-gold-200">S</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link href={`/products/${item.product.slug}`}
                        className="font-serif font-semibold text-gray-800 hover:text-gold-600 transition truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition ml-2 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gold-600 font-bold text-xl mt-2">₹{item.product.price.toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition"
                        ><Minus className="w-3 h-3" /></button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition"
                        ><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="premium-card p-6 sticky top-28">
                <h2 className="font-serif text-xl font-bold mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  {total >= 999 && (
                    <div className="flex justify-between text-emerald-600 text-xs">
                      <span>Free shipping applied</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gold-200/30 mt-5 pt-5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-2xl text-gray-900">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Link href="/orders"
                  className="gold-btn w-full mt-6 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Proceed to Checkout
                </Link>
                <Link href="/products"
                  className="block text-center text-sm text-gray-400 hover:text-gold-600 transition mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
