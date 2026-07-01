import Link from "next/link";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative rounded-xl overflow-hidden mb-4 aspect-[3/4] bg-gray-100 premium-shadow">
        {product.images?.[0]?.startsWith("http") ? (
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />
        ) : null}
        {!product.images?.[0]?.startsWith("http") && (
          <div className="w-full h-full flex items-center justify-center absolute inset-0">
            <span className="font-serif text-6xl text-gold-200">S</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-white text-xs font-medium bg-gold-600 px-3 py-1.5 rounded-full inline-block">
            Quick View
          </span>
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            New
          </span>
        )}
      </div>
      <h3 className="font-serif font-semibold text-gray-800 group-hover:text-gold-600 transition">
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
}
