"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/products/ProductCarousel";
import ProductGrid from "@/components/products/ProductGrid";
import TrustStrip from "@/components/TrustStrip";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import { Product as ProductType } from "@/components/types";

export default function Home() {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/home");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  console.log(products)

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <main>
      <Header />
      <Hero />
      <ProductCarousel
        eyebrow="The Collection"
        title="Signature Series"
        products={products?.signatureSeries}
        viewAllHref="/shop"
      />
      <TrustStrip />
      <ProductGrid
        eyebrow="Most Loved"
        title="Featured Fragrances"
        products={products?.featured}
        viewAllHref="/shop"
      />
      <BrandStory imageSrc="" />
      <Footer />
    </main>
  );
}