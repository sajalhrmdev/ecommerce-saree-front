"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Clock } from "lucide-react";
import { API_BASE } from "@/lib/constants";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { id: string; product: { name: string; slug: string }; quantity: number; price: number }[];
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    fetch(`${API_BASE}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center premium-card p-12 max-w-md">
          <Package className="w-16 h-16 mx-auto text-gold-300 mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-3">My Orders</h1>
          <p className="text-gray-500 mb-8">Please login to view your orders</p>
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
          <h1 className="font-serif text-4xl font-bold">My Orders</h1>
          <div className="premium-divider mt-4" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="text-center py-20 premium-card p-12">
            <Package className="w-20 h-20 mx-auto text-gold-200 mb-6" />
            <h2 className="font-serif text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start your journey with our exquisite saree collection.</p>
            <Link href="/products" className="gold-btn inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="premium-card p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Order #<span className="font-mono">{order.id.slice(0, 8)}</span>
                      </p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${statusStyles[order.status] || "bg-gray-50 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-gold-200/20 pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <Link href={`/products/${item.product.slug}`}
                        className="text-gray-700 hover:text-gold-600 transition"
                      >
                        {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                      </Link>
                      <span className="font-medium text-gray-800">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold-200/30 mt-5 pt-5 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-2xl text-gray-900">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
