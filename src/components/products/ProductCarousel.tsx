"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../SectionHeading";
import ProductCard from "./ProductCard";
import { Product } from "../types";

type ProductCarouselProps = {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
};

export default function ProductCarousel({
  eyebrow,
  title,
  products,
  viewAllHref,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div className="flex items-center gap-3">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-xs uppercase tracking-wide text-smoke hover:text-brass transition-colors font-body mr-2"
            >
              View all
            </a>
          )}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="p-2 border border-brass/30 text-ivory hover:border-brass hover:text-brass transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="p-2 border border-brass/30 text-ivory hover:border-brass hover:text-brass transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start flex-shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
