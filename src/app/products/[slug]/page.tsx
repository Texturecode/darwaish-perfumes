import Header from "@/components/Header";
import ProductDetail from "@/components/products/ProductDetail";
import ProductCarousel from "@/components/products/ProductCarousel";
import Footer from "@/components/Footer";
import { Product } from "@/components/types";

const SAMPLE_PRODUCT: Product = {
  id: "10",
  name: "Aqua Drift",
  slug: "aqua-drift",
  images: ["/products/aqua-drift.jpg", "/products/aqua-drift-2.jpg"],
  notes: "Inspired by the aromatic fougère tradition",
  description:
    "An aromatic fougère built around sea air and bergamot, settling into musk and amber. Built for daily wear in warm climates, with a 20% concentration designed to last well past midday.",
  fragranceNotes: {
    top: ["Sea notes", "Bergamot", "Green mandarin"],
    middle: ["Rosemary", "Lavender", "Cypress"],
    base: ["Mineral musk", "Patchouli", "Amber"],
  },
  concentration: "20% — Eau de Parfum",
  sku: "DAR-AQD-100",
  price: 2500,
  rating: 4.8,
  reviewCount: 36,
  soldOut: false,
};

const YOU_MAY_ALSO_LIKE: Product[] = [
  { id: "1", name: "Signature Black", slug: "signature-black", images: ["/products/signature-black.jpg"], price: 3199 },
  { id: "2", name: "Signature Gold", slug: "signature-gold", images: ["/products/signature-gold.jpg"], price: 3000 },
  { id: "7", name: "Aswad", slug: "aswad", images: ["/products/aswad.jpg"], notes: "Deep amber and spice", price: 3000 },
  { id: "8", name: "Mirage", slug: "mirage", images: ["/products/mirage.jpg"], notes: "Warm vanilla and saffron", price: 3000 },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = SAMPLE_PRODUCT; // replace with real lookup by params.slug

  return (
    <main>
      <Header cartCount={0} />
      <ProductDetail product={product} />
      <ProductCarousel
        eyebrow="Keep Exploring"
        title="You May Also Like"
        products={YOU_MAY_ALSO_LIKE}
        viewAllHref="/shop"
      />
      <Footer />
    </main>
  );
}