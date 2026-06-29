"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

interface CartItem {
    _id: string;
    productId: Product;
    quantity: number;
    price: number; // stored in smallest currency unit (e.g. cents)
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch("/api/cart", {
                    credentials: "include",
                });

                if (response.status === 401) {
                    router.replace("/login?next=/cart");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to load cart");
                }

                const data = await response.json();
                console.log(data)
                // API may return a single cart object or an array containing one
                const cartData = data.data
                setCart(cartData ?? null);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
                setError("We couldn't load your cart. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [router]);

    const handleQuantityChange = async (itemId: string, quantity: number) => {
        if (quantity < 1 || !cart) return;

        setUpdatingItemId(itemId);
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) throw new Error("Failed to update quantity");

            setCart((prev) =>
                prev
                    ? {
                        ...prev,
                        items: prev.items.map((item) =>
                            item._id === itemId ? { ...item, quantity } : item
                        ),
                    }
                    : prev
            );
        } catch (err) {
            console.error("Failed to update quantity:", err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!cart) return;

        setUpdatingItemId(itemId);
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to remove item");

            setCart((prev) =>
                prev
                    ? { ...prev, items: prev.items.filter((item) => item._id !== itemId) }
                    : prev
            );
        } catch (err) {
            console.error("Failed to remove item:", err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const subtotal =
        cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

    if (loading) {
        return (
            <main className="min-h-screen bg-ink flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-ivory">
                        <p className="text-lg">Loading your cart…</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-ink flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center text-ivory">
                        <p className="text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 border border-ivory/30 rounded-md hover:bg-ivory/10 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }


    const items = cart?.items ?? [];

    return (
        <main className="min-h-screen bg-ink flex flex-col">
            <Header />

            <div className="flex-1 px-4 sm:px-8 py-12 max-w-6xl mx-auto w-full">
                <h1 className="text-3xl font-semibold text-ivory mb-8">Your cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-ivory/70 text-lg mb-6">Your cart is empty.</p>
                        <button
                            onClick={() => router.push("/shop")}
                            className="px-6 py-2 bg-ivory text-ink rounded-md hover:bg-ivory/90 transition-colors"
                        >
                            Continue shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Items list */}
                        <div className="lg:col-span-2 divide-y divide-ivory/10 border-y border-ivory/10">
                            {items.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 py-6"
                                >
                                    <div className="w-20 h-20 bg-ivory/5 rounded-md shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.productId?.images[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.productId.images[0]}
                                                alt={item.productId.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-ivory/30 text-xs">No image</span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-ivory font-medium truncate">
                                            {item.productId?.name ?? "Unknown product"}
                                        </p>
                                        <p className="text-ivory/60 text-sm mt-1">
                                            Rs: {item.price} each
                                        </p>

                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center border border-ivory/20 rounded-md">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item._id, item.quantity - 1)
                                                    }
                                                    disabled={
                                                        updatingItemId === item._id || item.quantity <= 1
                                                    }
                                                    className="px-3 py-1 text-ivory disabled:opacity-30 hover:bg-ivory/10 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="px-4 text-ivory text-sm min-w-[2.5rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item._id, item.quantity + 1)
                                                    }
                                                    disabled={updatingItemId === item._id}
                                                    className="px-3 py-1 text-ivory disabled:opacity-30 hover:bg-ivory/10 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item._id)}
                                                disabled={updatingItemId === item._id}
                                                className="text-ivory/50 text-sm hover:text-ivory transition-colors disabled:opacity-30"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-ivory font-medium whitespace-nowrap">
                                        {item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="border border-ivory/10 rounded-lg p-6 sticky top-8">
                                <h2 className="text-ivory font-medium mb-4">Order summary</h2>

                                <div className="flex justify-between text-sm text-ivory/70 mb-2">
                                    <span>Subtotal</span>
                                    <span>Rs: {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-ivory/70 mb-4">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>

                                <div className="border-t border-ivory/10 pt-4 flex justify-between text-ivory font-semibold mb-6">
                                    <span>Total</span>
                                    <span>Rs: {subtotal}</span>
                                </div>

                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full py-3 bg-ivory text-ink rounded-md font-medium hover:bg-ivory/90 transition-colors"
                                >
                                    Checkout
                                </button>

                                <button
                                    onClick={() => router.push("/shop")}
                                    className="w-full py-3 mt-2 text-ivory/70 text-sm hover:text-ivory transition-colors"
                                >
                                    Continue shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}