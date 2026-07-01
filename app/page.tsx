import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { API_BASE } from "@/lib/constants";

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products/featured`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div>
      <HeroSlider />

      {/* ─── BRAND STORY ─── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Our Legacy</span>
          <h2 className="section-title mt-4">Where Tradition Meets <span className="text-gold-600">Timeless Beauty</span></h2>
          <div className="premium-divider mt-6" />
          <p className="section-subtitle mt-6 max-w-3xl">
            For generations, we have curated the finest sarees from across India — each a masterpiece woven with centuries-old techniques, 
            preserving the soul of our heritage in every fold.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", title: "Authentic Craftsmanship", desc: "Every saree is sourced directly from master weavers, ensuring genuine artistry." },
              { icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Premium Quality", desc: "We hand-select only the finest silks, cottons, and materials for our collection." },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Guaranteed Authenticity", desc: "Certificate of authenticity with every premium saree purchase." },
            ].map((f) => (
              <div key={f.title} className="premium-card p-8 text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition">
                  <svg className="w-8 h-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Collections</span>
            <h2 className="section-title mt-4">Shop by <span className="text-gold-600">Category</span></h2>
            <div className="premium-divider mt-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="group relative premium-card p-6 text-center overflow-hidden"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden relative border-2 border-transparent group-hover:border-gold-400 transition-all duration-500">
                  {cat.image?.startsWith("http") ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold-100 to-primary-100 flex items-center justify-center">
                      <span className="font-serif text-3xl text-gold-600">{cat.name[0]}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-serif font-semibold text-gray-800 group-hover:text-gold-600 transition">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat._count?.products || 0} items</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14">
            <div>
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Curated Selection</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4">
                Featured <span className="text-gold-600">Sarees</span>
              </h2>
              <div className="premium-divider mt-4" />
            </div>
            <Link href="/products"
              className="outline-btn mt-4 md:mt-0 text-sm"
            >
              View All Collections &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product: any) => {
              const discount = product.compareAt
                ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="relative rounded-xl overflow-hidden mb-4 aspect-[3/4] bg-gray-100 premium-shadow">
                    {product.images?.[0]?.startsWith("http") ? (
                      <img src={product.images[0]} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    ) : null}
                    {!product.images?.[0]?.startsWith("http") && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-6xl text-gold-200">S</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-sm font-medium bg-gold-600 px-3 py-1 rounded-full inline-block">
                        Quick View
                      </span>
                    </div>
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-gray-800 group-hover:text-gold-600 transition text-lg">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">{product.category.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
                    {product.compareAt && (
                      <span className="text-sm text-gray-400 line-through">₹{product.compareAt.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4">
            What Our <span className="text-gold-400">Customers Say</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mt-6" />
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { quote: "The Kanchipuram silk saree I ordered exceeded all expectations. The zari work is exquisite and the fabric feels luxurious.", name: "Priya Sharma", loc: "Mumbai, India" },
              { quote: "Absolutely stunning collection! The Banarasi saree arrived in beautiful packaging. Will definitely order again.", name: "Ananya Gupta", loc: "Delhi, India" },
              { quote: "International delivery was smooth and the saree quality is unmatched. True craftsmanship at its finest.", name: "Sarah Johnson", loc: "London, UK" },
            ].map((t) => (
              <div key={t.name} className="premium-card !bg-white/5 !border-gold-500/20 p-8 text-left hover:!bg-white/10">
                <div className="flex text-gold-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-serif font-semibold text-gold-300">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="py-16 bg-white border-y border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "M5 13l4 4L19 7", title: "Premium Quality", desc: "Handpicked sarees" },
            { icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Secure Shopping", desc: "100% safe checkout" },
            { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z", title: "Free Shipping", desc: "On orders over ₹999" },
            { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Easy Returns", desc: "7-day return policy" },
          ].map((f) => (
            <div key={f.title} className="text-center group">
              <div className="w-14 h-14 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-100 transition">
                <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h4 className="font-serif font-semibold text-gray-800">{f.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-24 bg-gradient-to-r from-primary-900 via-primary-800 to-charcoal text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Stay Connected</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">
            Join the <span className="text-gold-400">Saree Elegance</span> Family
          </h2>
          <p className="text-primary-200/70 mb-8">
            Subscribe for exclusive updates on new collections, weaving stories, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400 transition"
            />
            <button className="gold-btn whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
