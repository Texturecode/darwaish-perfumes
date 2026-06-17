import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product, formatPKR } from "./types";

export default function ProductCard({ product }: { product: Product }) {
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-4 w-full">
      <div className="relative aspect-square w-full bg-ink-soft overflow-hidden">
        <Image
          src={product?.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        {onSale && (
          <span className="absolute top-3 left-3 bg-oxblood text-ivory text-[10px] font-mono uppercase tracking-widest2 px-2 py-1">
            Sale
          </span>
        )}
        {product.soldOut && (
          <span className="absolute top-3 left-3 bg-smoke text-ink text-[10px] font-mono uppercase tracking-widest2 px-2 py-1">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg text-ivory group-hover:text-brass transition-colors duration-300">
          {product.name}
        </h3>

        {product.notes && (
          <p className="text-xs text-smoke font-body">{product.notes}</p>
        )}

        {product.rating && (
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={12} className="fill-brass text-brass" />
            <span className="text-xs font-mono text-smoke-light">
              {product.rating.toFixed(2)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-sm text-ivory">
            {formatPKR(product.price)}
          </span>
          {onSale && (
            <span className="font-mono text-xs text-smoke line-through">
              {formatPKR(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
