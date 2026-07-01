"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronRight, Star, Check, Shield, Truck, RotateCcw, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { API_BASE } from "@/lib/constants";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const waNumber = "918001454303";

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in this product:\n\n*${product?.name}*\nPrice: ₹${product?.price?.toLocaleString("en-IN")}${selectedSize ? `\nSize: ${selectedSize}` : ""}${selectedColor ? `\nColor: ${selectedColor}` : ""}\nQuantity: ${quantity}\n\nPlease call me back.`
    );
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    try {
      await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product!.id, quantity }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { alert("Failed to add to cart"); }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="w-12 h-12 border-4 border-gold-300 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-500">Product not found</div>;

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;

  return (
    <div className="bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-gold-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-gold-600 transition">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-gold-600 transition">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="relative rounded-2xl aspect-[3/4] overflow-hidden bg-white premium-shadow border border-gold-200/20">
              <Image src={product.images[selectedImage] || ""} alt={product.name} fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority
              />
              {discount > 0 && (
                <span className="absolute top-5 left-5 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold z-10">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition relative ${
                      selectedImage === i ? "border-gold-500 shadow-md" : "border-gray-200 hover:border-gold-300"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-gold-600 text-sm tracking-[0.2em] uppercase font-medium">{product.category.name}</span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-400">(42 reviews)</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
              {product.compareAt && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.compareAt.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                    Save ₹{(product.compareAt - product.price).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-b border-gold-200/30 py-6 space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              {product.material && (
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gold-500" />
                  <span className="font-medium">Material:</span> {product.material}
                </p>
              )}
            </div>

            {product.sizes?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition ${
                        selectedSize === size
                          ? "border-gold-500 bg-gold-50 text-gold-700"
                          : "border-gray-200 text-gray-600 hover:border-gold-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Color: <span className="text-gold-600">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition ${
                        selectedColor === color
                          ? "border-gold-500 bg-gold-50 text-gold-700"
                          : "border-gray-200 text-gray-600 hover:border-gold-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-gold-400 transition font-bold text-lg"
                >-</button>
                <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-gold-400 transition font-bold text-lg"
                >+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={addToCart}
                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  added
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "gold-btn text-lg"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button onClick={openWhatsApp}
                className="py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              >
                <MessageCircle className="w-5 h-5" />
                Book via WhatsApp
              </button>
            </div>

            <div className="text-sm text-gray-500 text-center">
              {product.stock > 0
                ? <span className="text-emerald-600 font-medium">&check; {product.stock} in stock</span>
                : <span className="text-red-500">Out of stock</span>}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, label: "Free Shipping", sub: "On orders ₹999+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
                { icon: Shield, label: "Secure", sub: "Protected checkout" },
              ].map((f) => (
                <div key={f.label} className="text-center p-3 rounded-xl bg-gold-50/50 border border-gold-200/20">
                  <f.icon className="w-5 h-5 text-gold-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">{f.label}</p>
                  <p className="text-[10px] text-gray-400">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
