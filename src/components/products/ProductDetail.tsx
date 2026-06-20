"use client";

import { useState } from "react";
import { Star, Share2, ShieldCheck, RotateCcw, Droplet } from "lucide-react";
import ProductGallery from "../ProductGallery";
// import FragranceNotes from "./FragranceNotes";
import QuantityStepper from "../QuantityStepper";
import BurnDivider from "../BurnDivider";
import { Product, formatPKR } from "../types";

// Trust bullets shown under the description — keep these specific to your
// actual policies/specs.
const TRUST_BULLETS = [
  { icon: RotateCcw, label: "15-day returns and exchange" },
  { icon: Droplet, label: "High oil concentration for lasting wear" },
  { icon: ShieldCheck, label: "Ethically sourced ingredients" },
];

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const gallery = product.images?.length ? product.images : [product.images[0]];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery images={gallery} alt={product.name} />

        <div className="flex flex-col gap-6">
          {product.notes && (
            <span className="text-sm text-smoke-light font-body italic">
              {product.notes}
            </span>
          )}

          <h1 className="font-display text-4xl sm:text-5xl text-ivory">
            {product.name}
          </h1>

          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating!)
                        ? "fill-brass text-brass"
                        : "text-smoke"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-mono text-smoke-light">
                {product.rating.toFixed(2)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl text-ivory">
              {formatPKR(product.price)}
            </span>
            {onSale && (
              <span className="font-mono text-base text-smoke line-through">
                {formatPKR(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <BurnDivider className="w-full max-w-xs" />

          {product.description && (
            <p className="text-sm text-smoke-light font-body leading-relaxed max-w-md">
              {product.description}
            </p>
          )}

          {/* {product.fragranceNotes && (
            <FragranceNotes
              top={product.fragranceNotes.top}
              middle={product.fragranceNotes.middle}
              base={product.fragranceNotes.base}
            />
          )} */}

          <ul className="flex flex-col gap-3 mt-2">
            {TRUST_BULLETS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-smoke-light font-body">
                <Icon size={16} className="text-brass shrink-0" />
                {label}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <QuantityStepper quantity={quantity} onChange={setQuantity} />

            <button
              type="button"
              disabled={product.soldOut}
              className="flex-1 min-w-[180px] px-8 py-3 bg-brass text-ink font-body text-sm uppercase tracking-wide hover:bg-brass-light disabled:bg-smoke disabled:text-ink-soft disabled:cursor-not-allowed transition-colors duration-300"
            >
              {product.soldOut ? "Sold Out" : "Add to Cart"}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-brass/15">
            {product.sku && (
              <span className="text-xs font-mono text-smoke">SKU: {product.sku}</span>
            )}
            <button
              type="button"
              className="flex items-center gap-2 text-xs uppercase tracking-wide text-smoke hover:text-brass transition-colors font-body"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}