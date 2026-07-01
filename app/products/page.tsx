import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/constants";

interface Props {
  searchParams: { category?: string; search?: string; sort?: string };
}

async function getProducts(params: string) {
  try {
    const res = await fetch(`${API_BASE}/api/products${params}`, { cache: "no-store" });
    if (!res.ok) return { products: [], pagination: { total: 0 } };
    return res.json();
  } catch {
    return { products: [], pagination: { total: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.sort) params.set("sort", searchParams.sort);

  const qs = params.toString() ? `?${params.toString()}` : "";
  const [data, categories] = await Promise.all([getProducts(qs), getCategories()]);
  const { products, pagination } = data;

  return (
    <div>
      <div className="bg-cream border-b border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            {searchParams.category
              ? categories.find((c: any) => c.slug === searchParams.category)?.name || "Collection"
              : "Our Collection"}
          </h1>
          <div className="premium-divider mt-4" />
          <p className="text-gray-500 mt-4">
            {pagination?.total || 0} exquisite designs waiting for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <aside className="md:w-64 shrink-0">
            <div className="premium-card p-6">
              <h2 className="font-serif text-lg font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-1">
                <Link href="/products"
                  className={`block px-4 py-2.5 rounded-lg text-sm transition ${
                    !searchParams.category
                      ? "bg-gold-50 text-gold-700 font-medium border border-gold-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Sarees
                </Link>
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`}
                    className={`block px-4 py-2.5 rounded-lg text-sm transition ${
                      searchParams.category === cat.slug
                        ? "bg-gold-50 text-gold-700 font-medium border border-gold-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="float-right text-xs text-gray-400">({cat._count?.products || 0})</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="premium-card p-6 mt-4">
              <h2 className="font-serif text-lg font-semibold text-gray-800 mb-4">Sort By</h2>
              <div className="space-y-2">
                {[
                  { key: "newest", label: "Newest First" },
                  { key: "price_asc", label: "Price: Low to High" },
                  { key: "price_desc", label: "Price: High to Low" },
                  { key: "name", label: "Name A-Z" },
                ].map((s) => (
                  <Link key={s.key} href={`/products${qs ? qs + "&" : "?"}sort=${s.key}`}
                    className={`block px-4 py-2 rounded-lg text-sm transition ${
                      (searchParams.sort || "newest") === s.key
                        ? "bg-gold-50 text-gold-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20 premium-card p-12">
                <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
                <Link href="/products" className="gold-btn inline-block">View All Products</Link>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-800">{products.length}</span> of{" "}
                    <span className="font-medium text-gray-800">{pagination?.total || 0}</span> designs
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
