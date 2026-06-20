import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/components/types";
import ShopFilters from "@/components/ShopFilters";

// Replace with a real fetch (Shopify Storefront API, CMS, or local catalog)
const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Signature Black", slug: "signature-black", images: ["/products/mystic-smoke.PNG"], price: 3199 },
  { id: "2", name: "Signature Gold", slug: "signature-gold", images: ["/products/blue-haven.PNG"], price: 3000 },
  { id: "5", name: "Oud Al Sultan", slug: "oud-al-sultan", images: ["/products/regal-mist.PNG"], notes: "Inspired by classic oud houses", price: 3000, rating: 4.95, reviewCount: 578 },
  { id: "6", name: "Stout Intense", slug: "stout-intense", images: ["/products/scarlet.PNG"], notes: "Oriental fougère for men", price: 3000, rating: 4.91, reviewCount: 22 },
  { id: "7", name: "Aswad", slug: "aswad", images: ["/products/lamina.PNG"], notes: "Deep amber and spice", price: 3000, rating: 4.86, reviewCount: 14 },
  { id: "8", name: "Mirage", slug: "mirage", images: ["/products/blue-haven.PNG"], notes: "Warm vanilla and saffron", price: 3000, rating: 4.89, reviewCount: 9 },
  { id: "10", name: "Aqua Drift", slug: "aqua-drift", images: ["/products/aqua-drift.PNG"], notes: "Aromatic fougère", price: 2500, rating: 4.8, reviewCount: 36 },
];

export default function ShopPage() {
  return (
    <main>
      <Header cartCount={0} />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        <span className="eyebrow">The Full Collection</span>
        <h1 className="font-display text-4xl sm:text-5xl text-ivory mt-4">
          Shop All Fragrances
        </h1>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[240px_1fr] gap-12">
        <ShopFilters />
        <ProductGrid title="" products={ALL_PRODUCTS} />
      </div>
      <Footer />
    </main>
  );
}