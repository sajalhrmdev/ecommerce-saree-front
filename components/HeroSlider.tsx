"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1616986491129-3e37cb654c82?w=1600&q=80",
    tag: "Heritage Collection 2024",
    title: "Elegance in",
    titleAccent: "Every Thread",
    desc: "Discover our exquisite collection of handcrafted sarees from the finest weaving traditions of India.",
    cta: "Explore Collection",
    ctaLink: "/products",
    cta2: "Silk Collection",
    cta2Link: "/products?category=silk-sarees",
    stats: [
      { n: "200+", l: "Handcrafted Designs" },
      { n: "50+", l: "Weaving Traditions" },
      { n: "5K+", l: "Happy Customers" },
    ],
  },
  {
    image: "https://images.pexels.com/photos/10317113/pexels-photo-10317113.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tag: "The Art of Handloom",
    title: "Woven with",
    titleAccent: "Tradition",
    desc: "Each thread tells a story passed down through generations of master weavers.",
    cta: "Shop Now",
    ctaLink: "/products",
    cta2: "Cotton Collection",
    cta2Link: "/products?category=cotton-sarees",
    stats: [
      { n: "50+", l: "Weaving Traditions" },
      { n: "200+", l: "Handcrafted Designs" },
      { n: "5K+", l: "Happy Customers" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1756483492198-8ca91227489b?w=1600&q=80",
    tag: "Festive Edit 2024",
    title: "Celebrate in",
    titleAccent: "Pure Silk",
    desc: "Make every occasion unforgettable with our premium collection of Banarasi silk sarees.",
    cta: "View Collection",
    ctaLink: "/products?category=banarasi-sarees",
    cta2: "All Products",
    cta2Link: "/products",
    stats: [
      { n: "5K+", l: "Happy Customers" },
      { n: "200+", l: "Handcrafted Designs" },
      { n: "50+", l: "Weaving Traditions" },
    ],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transform: `scale(${i === current ? 1 : 1.05})`,
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent z-10" />

      <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-float z-10" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float z-10" style={{ animationDelay: "-3s" }} />

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-24 md:py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 text-gold-300 text-sm tracking-widest uppercase mb-6">
              <span className="w-10 h-px bg-gold-400" />
              {slide.tag}
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {slide.title}
              <br />
              <span className="text-gold-400">{slide.titleAccent}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-200/80 leading-relaxed mb-10 max-w-lg">
              {slide.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.ctaLink} className="gold-btn text-lg px-10 py-4">
                {slide.cta}
              </Link>
              <Link href={slide.cta2Link}
                className="outline-btn border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4"
              >
                {slide.cta2}
              </Link>
            </div>
            <div className="flex gap-10 mt-14">
              {slide.stats.map((s) => (
                <div key={s.n}>
                  <p className="font-serif text-3xl font-bold text-gold-400">{s.n}</p>
                  <p className="text-xs text-primary-200/60 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-center relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-80 h-[28rem] rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/20 border border-gold-500/20">
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold-500/30 rounded-full" />
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-12 md:mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "w-10 h-2.5 bg-gold-400"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
