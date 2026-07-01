"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Users, Plus, List, ArrowRight } from "lucide-react";
import { API_BASE } from "@/lib/constants";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    Promise.all([
      fetch(`${API_BASE}/api/products`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([products, orders]) => {
        setStats({
          products: products.pagination?.total || products.length || 0,
          orders: Array.isArray(orders) ? orders.length : 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  if (!token || user?.role !== "ADMIN") {
    return <div className="min-h-[70vh] flex items-center justify-center"><p className="text-gray-500">Access denied. Admin only.</p></div>;
  }

  return (
    <div className="bg-cream/30 min-h-screen">
      <div className="bg-white border-b border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="font-serif text-4xl font-bold">Admin Dashboard</h1>
          <div className="premium-divider mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShoppingBag, label: "Total Products", value: stats.products, color: "text-gold-600", bg: "bg-gold-50" },
            { icon: Package, label: "Total Orders", value: stats.orders, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Users, label: "Registered Users", value: "-", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className="premium-card p-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-7 h-7 ${s.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{loading ? "..." : s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/products" className="premium-card p-8 group flex items-center justify-between">
            <div>
              <List className="w-10 h-10 text-gold-600 mb-4" />
              <h2 className="font-serif text-xl font-semibold group-hover:text-gold-600 transition">Manage Products</h2>
              <p className="text-gray-500 text-sm mt-1">View, edit, add or remove products</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gold-400 group-hover:translate-x-1 transition" />
          </Link>
          <Link href="/admin/products/new" className="premium-card p-8 group flex items-center justify-between">
            <div>
              <Plus className="w-10 h-10 text-gold-600 mb-4" />
              <h2 className="font-serif text-xl font-semibold group-hover:text-gold-600 transition">Add New Product</h2>
              <p className="text-gray-500 text-sm mt-1">Add a new saree to the catalog</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gold-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
