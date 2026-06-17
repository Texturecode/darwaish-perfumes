import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import ProductGrid from "@/components/ProductGrid";
import TrustStrip from "@/components/TrustStrip";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import { Product } from "@/components/types";

const SIGNATURE_SERIES: Product[] = [
  { id: "1", name: "Signature Black", slug: "signature-black", images: ["/products/mystic-smoke.PNG"], price: 3199 },
  { id: "2", name: "Signature Gold", slug: "signature-gold", images: ["/products/blue-haven.PNG"], price: 3000 },
  { id: "3", name: "Signature Trio", slug: "signature-trio", images: ["/products/4ocean.PNG"], price: 8200, compareAtPrice: 9200 },
  { id: "4", name: "Signature Duo", slug: "signature-duo", images: ["/products/ossar.PNG"], price: 5700, compareAtPrice: 6200 },
];

const FEATURED: Product[] = [
  { id: "5", name: "Oud Al Sultan", slug: "oud-al-sultan", images: ["/products/regal-mist.PNG"], notes: "Inspired by classic oud houses", price: 3000, rating: 4.95, reviewCount: 578 },
  { id: "6", name: "Stout Intense", slug: "stout-intense", images: ["/products/scarlet.PNG"], notes: "Oriental fougère for men", price: 3000, rating: 4.91, reviewCount: 22 },
  { id: "7", name: "Aswad", slug: "aswad", images: ["/products/lamina.PNG"], notes: "Deep amber and spice", price: 3000, rating: 4.86, reviewCount: 14 },
  { id: "8", name: "Mirage", slug: "mirage", images: ["/products/blue-haven.PNG"], notes: "Warm vanilla and saffron", price: 3000, rating: 4.89, reviewCount: 9 },
];

export default function Home() {
  return (
    <main>
      <Header cartCount={0} />
      <Hero />

      <ProductCarousel
        eyebrow="The Collection"
        title="Signature Series"
        products={SIGNATURE_SERIES}
        viewAllHref="/collections/signature"
      />

      <TrustStrip />

      <ProductGrid
        eyebrow="Most Loved"
        title="Featured Fragrances"
        products={FEATURED}
        viewAllHref="/shop"
      />

      <BrandStory imageSrc="/brand/story.jpg" />

      <Footer />
    </main>
  );
}
