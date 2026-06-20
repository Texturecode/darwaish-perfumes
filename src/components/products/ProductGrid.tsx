import SectionHeading from "../SectionHeading";
import ProductCard from "./ProductCard";
import { Product } from "../types";

type ProductGridProps = {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
  light?: boolean;
};

export default function ProductGrid({
  eyebrow,
  title,
  products,
  viewAllHref,
  light = false,
}: ProductGridProps) {
  return (
    <section className={`py-20 lg:px-10 max-w-7xl mx-auto ${light ? "text-ink" : ""}`}>
      <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} light={light} />
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="text-xs uppercase tracking-wide text-smoke hover:text-brass transition-colors font-body"
          >
            View all
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
