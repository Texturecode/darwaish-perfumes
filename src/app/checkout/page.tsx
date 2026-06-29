"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Cart } from "../cart/page";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province?: string;
    postalCode?: string;
    country: string;
}

const SHIPPING_FEE = 300; // Fixed shipping fee for now

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"cart" | "shipping" | "review" | "confirmation">("cart");

    const [formData, setFormData] = useState<ShippingAddress>({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Pakistan",
    });

    const [orderNumber, setOrderNumber] = useState<string>("");

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


    const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingFee = cart?.items && cart?.items?.length > 0 ? SHIPPING_FEE : 0;
    const total = subtotal as number + shippingFee;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleContinueToShipping = () => {
        setStep("shipping");
    };

    const handleContinueToReview = () => {
        // Validation
        if (
            !formData.fullName ||
            !formData.phone ||
            !formData.addressLine1 ||
            !formData.city
        ) {
            setError("Please fill in all required fields");
            return;
        }
        setError(null);
        setStep("review");
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            const orderItems = cart?.items?.map((item) => ({
                product: item.productId,
                name: item?.productId.name,
                image: item?.productId?.images[0] || '',
                price: item?.productId.price,
                quantity: item.quantity,
            }));

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress: formData,
                    subtotal,
                    shippingFee: SHIPPING_FEE,
                    total,
                    cart: cart?._id,
                    notes: "Cash on Delivery",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to place order");
                setLoading(false);
                return;
            }

            // Success - clear cart and show confirmation
            setOrderNumber(data.data.orderNumber);
            localStorage.removeItem("cart");
            setStep("confirmation");
        } catch (err) {
            setError("An error occurred while placing the order");
            console.error(err);
            setLoading(false);
        }
    };

    if (step === "confirmation") {
        return (
            <main className="min-h-screen flex flex-col bg-ink">
                <Header />
                <div className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-green-900/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-8 h-8 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h1 className="font-display text-3xl text-ivory mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-smoke-light mb-2">
                            Thank you for your order
                        </p>
                        <p className="font-mono text-lg text-brass mb-6">
                            Order #: {orderNumber}
                        </p>
                        <p className="text-smoke-light mb-8">
                            We'll send you an email confirmation with your order details. Your fragrances will be shipped to the address provided.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => router.push("/shop")}
                            className="w-full px-6 py-3 bg-ivory text-ink rounded font-semibold hover:bg-smoke-light transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <Link href="/">
                            <button className="w-full px-6 py-3 bg-smoke text-ivory rounded font-semibold hover:bg-smoke-light transition-colors">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    //   if (cart.length === 0) {
    //     return (
    //       <main className="min-h-screen flex flex-col bg-ink">
    //         <Header />
    //         <div className="flex-1 flex items-center justify-center">
    //           <div className="text-center">
    //             <ShoppingCart size={64} className="text-smoke mx-auto mb-4" />
    //             <h1 className="font-display text-2xl text-ivory mb-2">
    //               Your cart is empty
    //             </h1>
    //             <Link href="/shop">
    //               <button className="mt-4 px-6 py-2 bg-ivory text-ink rounded hover:bg-smoke-light transition-colors">
    //                 Continue Shopping
    //               </button>
    //             </Link>
    //           </div>
    //         </div>
    //         <Footer />
    //       </main>
    //     );
    //   }

    console.log({cart})
    return (
        <main className="min-h-screen flex flex-col bg-ink">
            <Header />

            <div className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        {(["cart", "shipping", "review"] as const).map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s
                                            ? "bg-brass text-ink"
                                            : ["cart", "shipping", "review"].indexOf(s) <
                                                ["cart", "shipping", "review"].indexOf(step)
                                                ? "bg-green-600 text-ivory"
                                                : "bg-smoke text-smoke-light"
                                        }`}
                                >
                                    {["cart", "shipping", "review"].indexOf(s) <
                                        ["cart", "shipping", "review"].indexOf(step) ? (
                                        "✓"
                                    ) : (
                                        ["cart", "shipping", "review"].indexOf(s) + 1
                                    )}
                                </div>
                                <span className="text-sm uppercase tracking-wide text-smoke-light ml-3">
                                    {s === "cart" ? "Cart" : s === "shipping" ? "Shipping" : "Review"}
                                </span>
                                {["cart", "shipping", "review"].indexOf(s) <
                                    ["cart", "shipping", "review"].length - 1 && (
                                        <div className="flex-1 h-px bg-smoke mx-4"></div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 mb-8">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === "cart" && (
                            <div>
                                <h2 className="font-display text-2xl text-ivory mb-6">
                                    Your Cart
                                </h2>
                                <div className="space-y-4 mb-8">
                                    {cart?.items.map((item: any) => (
                                        <div
                                            key={item?.productId?.productId}
                                            className="flex gap-4 pb-4 border-b border-smoke/20"
                                        >
                                            <img
                                                src={item?.productId?.images[0]}
                                                alt={item?.productId?.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-display text-lg text-ivory mb-2">
                                                    {item?.productId.name}
                                                </h3>
                                                <p className="text-sm text-smoke-light mb-2">
                                                    Qty: {item?.quantity}
                                                </p>
                                                <p className="font-body text-ivory">
                                                    Rs. {(item?.productId?.price * item.quantity).toLocaleString("en-PK")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleContinueToShipping}
                                    className="w-full px-6 py-3 bg-ivory text-ink rounded font-semibold hover:bg-smoke-light transition-colors"
                                >
                                    Continue to Shipping
                                </button>
                            </div>
                        )}

                        {step === "shipping" && (
                            <div>
                                <h2 className="font-display text-2xl text-ivory mb-6">
                                    Shipping Address
                                </h2>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-body text-smoke-light mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-body text-smoke-light mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                            placeholder="+92 300 1234567"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-body text-smoke-light mb-2">
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                            placeholder="Street address"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-body text-smoke-light mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                            placeholder="Apt, suite, etc. (optional)"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-body text-smoke-light mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                                placeholder="Karachi"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-body text-smoke-light mb-2">
                                                Province
                                            </label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                                placeholder="Sindh"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-body text-smoke-light mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                                            placeholder="75500"
                                        />
                                    </div>
                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep("cart")}
                                            className="flex-1 px-6 py-3 bg-smoke text-ivory rounded font-semibold hover:bg-smoke-light transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleContinueToReview}
                                            className="flex-1 px-6 py-3 bg-ivory text-ink rounded font-semibold hover:bg-smoke-light transition-colors"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === "review" && (
                            <div>
                                <h2 className="font-display text-2xl text-ivory mb-6">
                                    Review Order
                                </h2>
                                <div className="space-y-6">
                                    <div className="border-b border-smoke/20 pb-6">
                                        <h3 className="font-display text-lg text-ivory mb-4">
                                            Items
                                        </h3>
                                        {cart?.items.map((item: any) => (
                                            <div key={item.productId} className="flex justify-between mb-2">
                                                <span className="text-smoke-light">
                                                    {item.name} x {item.quantity}
                                                </span>
                                                <span className="text-ivory">
                                                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-b border-smoke/20 pb-6">
                                        <h3 className="font-display text-lg text-ivory mb-4">
                                            Shipping Address
                                        </h3>
                                        <p className="text-smoke-light mb-1">{formData.fullName}</p>
                                        <p className="text-smoke-light mb-1">{formData.addressLine1}</p>
                                        {formData.addressLine2 && (
                                            <p className="text-smoke-light mb-1">{formData.addressLine2}</p>
                                        )}
                                        <p className="text-smoke-light mb-1">
                                            {formData.city}, {formData.province} {formData.postalCode}
                                        </p>
                                        <p className="text-smoke-light">{formData.country}</p>
                                        <p className="text-smoke-light mt-2">{formData.phone}</p>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-display text-lg text-ivory mb-4">
                                            Payment Method
                                        </h3>
                                        <p className="text-smoke-light">
                                            💵 Cash on Delivery (COD)
                                        </p>
                                        <p className="text-sm text-smoke-light mt-2">
                                            Payment will be collected at the time of delivery
                                        </p>
                                    </div>
                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep("shipping")}
                                            className="flex-1 px-6 py-3 bg-smoke text-ivory rounded font-semibold hover:bg-smoke-light transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-brass text-ink rounded font-semibold hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Placing Order..." : "Place Order"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-smoke/20 border border-smoke/40 rounded p-6 sticky top-35">
                            <h3 className="font-display text-lg text-ivory mb-6">
                                Order Summary
                            </h3>
                            <div className="space-y-3 mb-6 pb-6 border-b border-smoke/20">
                                <div className="flex justify-between">
                                    <span className="text-smoke-light">Subtotal</span>
                                    <span className="text-ivory">
                                        Rs. {subtotal?.toLocaleString("en-PK")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-smoke-light">Shipping</span>
                                    <span className="text-ivory">
                                        Rs. {SHIPPING_FEE.toLocaleString("en-PK")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-display text-lg text-ivory">Total</span>
                                <span className="font-display text-xl text-brass">
                                    Rs. {total.toLocaleString("en-PK")}
                                </span>
                            </div>
                            <p className="text-xs text-smoke-light mt-4">
                                Cash on Delivery payment accepted
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
