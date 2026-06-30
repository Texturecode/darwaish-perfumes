import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/products/ProductCarousel";
import ProductGrid from "@/components/products/ProductGrid";
import TrustStrip from "@/components/TrustStrip";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import { Product as ProductType } from "@/components/types";

async function getProducts(): Promise<ProductType[]> {
  const URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.products as ProductType[];
}

export default async function Home() {
  const products = await getProducts();

  const signatureSeries = products.slice(0, 4);
  const featured = products.filter((p: any) => p.isFeatured).slice(0, 4);

  return (
    <main>
      <Header />
      <Hero />
      <ProductCarousel
        eyebrow="The Collection"
        title="Signature Series"
        products={signatureSeries}
        viewAllHref="/shop"
      />
      <TrustStrip />
      <ProductGrid
        eyebrow="Most Loved"
        title="Featured Fragrances"
        products={featured}
        viewAllHref="/shop"
      />
      <BrandStory imageSrc="" />
      <Footer />
    </main>
  );
}