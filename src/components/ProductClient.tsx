"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  RefreshCcw,
  Truck,
} from "lucide-react";

export default function ProductClient({ product }: any) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Home / Products / {product.name}
      </div>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images.map((img: string) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-lg overflow-hidden w-20 h-20 ${
                  selectedImage === img ? "border-black" : "border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt="thumb"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            ⭐ {product.rating} ({product.reviews} reviews)
          </div>

          <div className="text-2xl font-semibold mt-4">
            Rs. {product.price}
          </div>

          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mt-6 text-sm">
            {product.features.map((f: string) => (
              <div key={f} className="flex items-center gap-2">
                <ShieldCheck size={16} />
                {f}
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={decrease}
              className="p-2 border rounded-md"
            >
              <Minus size={16} />
            </button>

            <span className="text-lg">{qty}</span>

            <button
              onClick={increase}
              className="p-2 border rounded-md"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button className="flex-1 border py-3 rounded-xl">
              Buy Now
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <Truck size={18} />
              Fast Delivery
            </div>
            <div className="flex flex-col items-center">
              <RefreshCcw size={18} />
              Easy Return
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={18} />
              Secure
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Notes */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-4">Fragrance Notes</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <NoteCard title="Top Notes" items={product.notes.top} />
          <NoteCard title="Middle Notes" items={product.notes.middle} />
          <NoteCard title="Base Notes" items={product.notes.base} />
        </div>
      </section>

      {/* Related */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-4">You May Also Like</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {product.related.map((p: any) => (
            <div key={p.name} className="border rounded-xl p-4">
              <div className="h-40 bg-gray-100 rounded-lg mb-3" />
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">Rs. {p.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function NoteCard({ title, items }: any) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {items.map((i: string) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}