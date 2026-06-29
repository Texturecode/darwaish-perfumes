"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopFilters from "@/components/ShopFilters";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  notes?: string;
  rating?: number;
  reviewCount?: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (minPrice > 0) params.append("minPrice", minPrice.toString());
        if (maxPrice < 10000) params.append("maxPrice", maxPrice.toString());
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", "12");

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, search, page]);

  return (
    <main className="min-h-screen flex flex-col bg-ink">
      <Header />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8 w-full">
        <span className="text-sm uppercase tracking-widest text-brass">
          The Full Collection
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-ivory mt-4">
          Shop All Fragrances
        </h1>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[240px_1fr] gap-12 flex-1 w-full pb-16">
        <ShopFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          search={search}
          onSearchChange={setSearch}
        />

        <div>
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 mb-8">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-smoke/20 rounded h-96 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-smoke-light text-lg">
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 overflow-hidden rounded bg-smoke/20 aspect-square">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-display text-lg text-ivory mb-1 group-hover:text-brass transition-colors">
                      {product.name}
                    </h3>
                    {product.notes && (
                      <p className="text-sm text-smoke-light italic mb-2">
                        {product.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-body text-lg text-ivory">
                        Rs. {product.price.toLocaleString("en-PK")}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-smoke-light line-through">
                          Rs. {product.compareAtPrice.toLocaleString("en-PK")}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex text-brass">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(product.rating!)
                                ? "★"
                                : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-smoke-light">
                          ({product.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}