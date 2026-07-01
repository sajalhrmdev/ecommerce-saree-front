"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { API_BASE } from "@/lib/constants";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAt: "",
    categoryId: "",
    stock: "0",
    material: "",
    isFeatured: false,
  });
  const [images, setImages] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string) => {
    setForm((prev) => ({
      ...prev,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const addField = (setter: Function) => setter((prev: string[]) => [...prev, ""]);
  const removeField = (setter: Function, index: number) =>
    setter((prev: string[]) => prev.filter((_, i) => i !== index));
  const updateField = (setter: Function, index: number, value: string) =>
    setter((prev: string[]) => prev.map((v, i) => (i === index ? value : v)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        compareAt: form.compareAt ? parseFloat(form.compareAt) : undefined,
        categoryId: form.categoryId,
        stock: parseInt(form.stock),
        material: form.material || undefined,
        isFeatured: form.isFeatured,
        images: images.filter(Boolean),
        sizes: sizes.filter(Boolean),
        colors: colors.filter(Boolean),
      };

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  if (!token || user?.role !== "ADMIN") {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={(e) => { handleChange(e); generateSlug(e.target.value); }}
              required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange}
              required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹) *</label>
            <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange}
              required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare At Price</label>
            <input name="compareAt" type="number" step="0.01" min="0" value={form.compareAt} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
              required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}
              required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input name="material" value={form.material} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange}
              className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium">Featured Product</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URLs</label>
          {images.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input value={url} onChange={(e) => updateField(setImages, i, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  {images.length > 1 && (
                    <button type="button" onClick={() => removeField(setImages, i)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {url && (
                  <div className="relative w-32 h-40 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                    {imgErrors[i] ? (
                      <span className="text-xs text-gray-400 px-2 text-center">Blocked by server<br/>(hotlink protection)</span>
                    ) : (
                      <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addField(setImages)}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add another image
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sizes</label>
          {sizes.map((size, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={size} onChange={(e) => updateField(setSizes, i, e.target.value)}
                placeholder="e.g. 6.3 yards" className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {sizes.length > 1 && (
                <button type="button" onClick={() => removeField(setSizes, i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField(setSizes)}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add another size
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Colors</label>
          {colors.map((color, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={color} onChange={(e) => updateField(setColors, i, e.target.value)}
                placeholder="e.g. Red" className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {colors.length > 1 && (
                <button type="button" onClick={() => removeField(setColors, i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField(setColors)}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add another color
          </button>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50">
            {saving ? "Saving..." : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
