import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Saree Elegance - Premium Saree Boutique",
  description: "Discover our exquisite collection of handcrafted sarees. Silk, cotton, banarasi and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-charcoal text-gold-200 text-xs text-center py-2 px-4 tracking-widest uppercase">
          Free shipping on orders over ₹999 | Worldwide delivery | 7-day easy returns
        </div>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-charcoal text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="md:col-span-1">
                <h3 className="font-serif text-3xl text-gold-400 mb-4">Saree Elegance</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Celebrating India&apos;s rich textile heritage. Each saree is a masterpiece handpicked from the finest weaving traditions.
                </p>
                <div className="flex gap-4 mt-6">
                  {["FB", "IG", "YT", "PT"].map((s) => (
                    <span key={s} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-xs text-gray-400 hover:border-gold-400 hover:text-gold-400 transition cursor-pointer">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-serif text-lg text-gold-300 mb-5">Quick Links</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  {["About Us", "Contact", "Shipping Policy", "Returns & Exchanges", "Privacy Policy"].map((l) => (
                    <li key={l} className="hover:text-gold-400 transition cursor-pointer">{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-serif text-lg text-gold-300 mb-5">Categories</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  {["Silk Sarees", "Cotton Sarees", "Banarasi Sarees", "Georgette Sarees", "Chiffon Sarees"].map((l) => (
                    <li key={l} className="hover:text-gold-400 transition cursor-pointer">{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-serif text-lg text-gold-300 mb-5">Contact Us</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>hello@sareelegance.com</li>
                  <li>+91 1800-123-456</li>
                  <li className="mt-4 italic font-serif text-gold-200">
                    &ldquo;Where tradition meets elegance&rdquo;
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <span>&copy; 2024 Saree Elegance. All rights reserved.</span>
              <span className="mt-2 md:mt-0">Crafted with passion for the timeless art of weaving</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
