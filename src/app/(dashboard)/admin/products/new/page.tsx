"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { CATEGORIES, CONCENTRATIONS } from "@/utils/constants";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    // const formData = new FormData(e.currentTarget);
    // await fetch("/api/admin/products", { method: "POST", body: formData });
    await new Promise((r) => setTimeout(r, 700)); // placeholder
    setSaving(false);
    router.push("/admin/products");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-10">
          {/* Basic info */}
          <section className="flex flex-col gap-5">
            <span className="eyebrow">Basic Information</span>

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-wide text-smoke font-body">
                Product Name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="e.g. Aqua Drift"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="notes-line" className="text-xs uppercase tracking-wide text-smoke font-body">
                Inspiration Line
              </label>
              <input
                id="notes-line"
                name="notesLine"
                placeholder="e.g. Inspired by Acqua di Giò Profondo"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
              <span className="text-xs text-smoke font-body">
                Shown in italics under the product title on the storefront.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-xs uppercase tracking-wide text-smoke font-body">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the fragrance experience…"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors resize-none"
              />
            </div>
          </section>
        </div>

        {/* Right column — Images preview and upload */}
        <aside className="md:col-span-1 flex flex-col gap-4">
          <section className="flex flex-col gap-4 sticky top-24">
            <span className="eyebrow">Product Images</span>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-4">
                {images.map((src, i) => (
                  <div key={src} className="relative w-36 h-36 bg-ink-soft border border-brass/20 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-oxblood text-ivory flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <label className="h-36 flex flex-col items-center justify-center gap-1.5 border border-dashed border-brass/30 text-smoke hover:text-brass hover:border-brass/60 cursor-pointer transition-colors">
                <Upload size={18} />
                <span className="text-xs uppercase tracking-wide font-body">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
              </label>
            </div>
          </section>
        </aside>

        {/* Fragrance notes — the perfume-specific section */}
        <section className="flex flex-col gap-5">
          <span className="eyebrow">Fragrance Notes</span>
          <p className="text-xs text-smoke font-body -mt-2">
            Comma-separated. Shown top to base in the order worn.
          </p>

          {[
            { id: "topNotes", label: "Top Notes", placeholder: "Sea notes, Bergamot, Green mandarin" },
            { id: "middleNotes", label: "Heart Notes", placeholder: "Rosemary, Lavender, Cypress" },
            { id: "baseNotes", label: "Base Notes", placeholder: "Mineral musk, Patchouli, Amber" },
          ].map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label htmlFor={field.id} className="text-xs uppercase tracking-wide text-smoke font-body">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                placeholder={field.placeholder}
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>
          ))}
        </section>

        {/* Pricing & inventory */}
        <section className="flex flex-col gap-5">
          <span className="eyebrow">Pricing &amp; Inventory</span>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-xs uppercase tracking-wide text-smoke font-body">
                Price (PKR)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                required
                placeholder="2500"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="compareAtPrice" className="text-xs uppercase tracking-wide text-smoke font-body">
                Compare-at Price (optional)
              </label>
              <input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                min={0}
                placeholder="3000"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="stock" className="text-xs uppercase tracking-wide text-smoke font-body">
                Stock Quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                required
                placeholder="50"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="sku" className="text-xs uppercase tracking-wide text-smoke font-body">
                SKU
              </label>
              <input
                id="sku"
                name="sku"
                placeholder="DAR-AQD-100"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory placeholder:text-smoke font-mono focus:outline-none focus:border-brass transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Organization */}
        <section className="flex flex-col gap-5">
          <span className="eyebrow">Organization</span>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-xs uppercase tracking-wide text-smoke font-body">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory focus:outline-none focus:border-brass transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="concentration" className="text-xs uppercase tracking-wide text-smoke font-body">
                Concentration
              </label>
              <select
                id="concentration"
                name="concentration"
                className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory focus:outline-none focus:border-brass transition-colors"
              >
                {CONCENTRATIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-smoke-light font-body cursor-pointer w-fit">
            <input type="checkbox" name="status" value="Active" defaultChecked className="w-4 h-4 accent-brass bg-transparent border border-brass/40" />
            Publish immediately (visible on storefront)
          </label>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-brass text-ink text-sm font-body uppercase tracking-wide hover:bg-brass-light disabled:bg-smoke disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-8 py-3 border border-brass/30 text-ivory text-sm font-body uppercase tracking-wide hover:border-brass hover:text-brass transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}