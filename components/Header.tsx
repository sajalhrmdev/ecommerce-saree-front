"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { API_BASE } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => { if (data.id) setUser(data); })
        .catch(() => {});
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">
              Saree Elegance
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop" },
              { href: "/products?category=silk-sarees", label: "Silk" },
              { href: "/products?category=banarasi-sarees", label: "Banarasi" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-gold-600 transition relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-gold-600 transition flex items-center gap-1"
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
                <Link href="/orders"
                  className="text-sm font-medium text-gray-600 hover:text-gold-600 transition"
                >
                  Orders
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-gold-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href={user.role === "ADMIN" ? "/admin" : "/orders"}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gold-600 transition"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
                <button onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gold-600 transition"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-6 space-y-1 border-t border-gray-100 pt-4">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop All" },
              { href: "/products?category=silk-sarees", label: "Silk Sarees" },
              { href: "/products?category=banarasi-sarees", label: "Banarasi Sarees" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="block py-2 text-gray-600 hover:text-gold-600 transition font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" className="block py-2 text-gold-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin" className="block py-2 text-gold-600 font-medium" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                <Link href="/orders" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Orders</Link>
              </>
            )}
            {user && (
              <button onClick={logout} className="block py-2 text-red-500 font-medium w-full text-left">Logout</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
