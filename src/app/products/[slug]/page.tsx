"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import ProductDetail from "@/components/products/ProductDetail";
import ProductCarousel from "@/components/products/ProductCarousel";
import Footer from "@/components/Footer";
import { IProduct } from "@/models/Product";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user and cart count
  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);

          // Fetch cart from API
          const cartRes = await fetch("/api/cart", { credentials: "include" });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const count = cartData.data?.items?.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            ) || 0;
            setCartCount(count);
          }
        } else {
          // Fetch from localStorage for non-authenticated users
          const cart = localStorage.getItem("cart");
          if (cart) {
            const items = JSON.parse(cart) as CartItem[];
            setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user/cart:", err);
        const cart = localStorage.getItem("cart");
        if (cart) {
          const items = JSON.parse(cart) as CartItem[];
          setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        }
      }
    };

    fetchUserAndCart();
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // First, get all products and find by slug
        const res = await fetch(`/api/products?limit=100`);
        const data = await res.json();

        if (data.success) {
          const foundProduct = data.data.find(
            (p: IProduct) => p.slug === slug
          );
          if (foundProduct) {
            setProduct(foundProduct);
            // Fetch related products (same category)
            const related = data.data.filter(
              (p: IProduct) =>
                p.category === foundProduct.category &&
                p._id.toString() !== foundProduct._id.toString()
            );
            setRelatedProducts(related.slice(0, 4));
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (user) {
      // Add to cart using API for logged-in users
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id.toString(),
            quantity: quantity,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const count = data.data?.items?.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ) || 0;
          setCartCount(count);
          alert(`${product.name} added to cart!`);
        } else {
          alert("Failed to add to cart");
        }
      } catch (err) {
        console.error("Failed to add to cart:", err);
        alert("Failed to add to cart");
      }
    } else {
      // Add to localStorage for non-authenticated users
      const cartItem: CartItem = {
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      };

      const existingCart = localStorage.getItem("cart");
      let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

      const existingItem = cart.find(
        (item) => item.productId === cartItem.productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      alert(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  if (error && !loading) {
    return (
      <main>
        <Header />
        <div className="min-h-screen bg-ink flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-ivory text-ink rounded hover:bg-smoke-light transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <Header cartCount={cartCount} />
        <div className="min-h-screen bg-ink flex items-center justify-center">
          <div className="text-center">
            <p className="text-smoke-light text-lg">Loading product...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <Header cartCount={cartCount} />
        <div className="min-h-screen bg-ink flex items-center justify-center">
          <div className="text-center">
            <p className="text-smoke-light text-lg">Product not found</p>
            <button
              onClick={() => router.push("/shop")}
              className="mt-4 px-6 py-2 bg-ivory text-ink rounded hover:bg-smoke-light transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const convertedProduct = {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    images: product.images,
    description: product.description,
    notes: product.notes,
    fragranceNotes: product.fragranceNotes,
    concentration: product.concentration,
    sku: product.sku,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldOut: product.status === "Sold Out",
  };

  const convertedRelated = relatedProducts.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    images: p.images,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    notes: p.notes,
  }));

  return (
    <main>
      <Header cartCount={cartCount} />
      <ProductDetail
        product={convertedProduct}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
      {convertedRelated.length > 0 && (
        <ProductCarousel
          eyebrow="Keep Exploring"
          title="You May Also Like"
          products={convertedRelated}
          viewAllHref="/shop"
        />
      )}
      <Footer />
    </main>
  );
}
