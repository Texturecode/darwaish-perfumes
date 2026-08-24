"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [slider, setSlider] = useState<{ _id?: string; src: string; alt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlider, setSavingSlider] = useState(false);
  const [sliderMessage, setSliderMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashboardRes, sliderRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/home-slider"),
        ]);

        const dashboardData = await dashboardRes.json();
        if (dashboardData.success) {
          setStats({
            totalProducts: dashboardData.data.totalProducts || 0,
            totalCategories: dashboardData.data.totalCategories || 0,
            totalOrders: dashboardData.data.totalOrders || 0,
            totalRevenue: dashboardData.data.recentOrders?.reduce(
              (sum: number, order: any) => sum + (order.total || 0),
              0
            ) || 0,
          });
        }

        const sliderData = await sliderRes.json();
        if (sliderData.success && Array.isArray(sliderData.data)) {
          setSlider(sliderData.data.map((item: any) => ({
            _id: item._id,
            src: item.src,
            alt: item.alt || "Homepage slider image",
          })));
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSliderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSavingSlider(true);
    setSliderMessage(null);

    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch("/api/home-slider", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setSliderMessage(data.error || "Failed to upload slide");
        return;
      }

      const nextSlides = data.data.map((item: any) => ({
        _id: item._id,
        src: item.src,
        alt: item.alt || "Homepage slider image",
      }));

      setSlider((prev) => [...prev, ...nextSlides.filter(
        (nextSlide) => !prev.some((existing) => existing.src === nextSlide.src)
      )]);
      setSliderMessage("Slider image saved successfully.");
      event.target.value = "";
    } catch (error) {
      console.error(error);
      setSliderMessage("Something went wrong while uploading slider image.");
    } finally {
      setSavingSlider(false);
    }
  };

  const handleSliderReset = async () => {
    try {
      const res = await fetch("/api/home-slider", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setSliderMessage(data.error || "Failed to reset slides");
        return;
      }

      setSlider([]);
      setSliderMessage("Default slider restored.");
    } catch (error) {
      console.error(error);
      setSliderMessage("Failed to restore the default slider.");
    }
  };

  const handleSliderRemove = async (id?: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/home-slider?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setSliderMessage(data.error || "Failed to remove slider image");
        return;
      }

      const nextSlides = slider.filter((slide) => slide._id !== id);
      setSlider(nextSlides);
      setSliderMessage("Slider image removed.");
    } catch (error) {
      console.error(error);
      setSliderMessage("Failed to remove slider image.");
    }
  };

  if (loading) {
    return <div className="text-smoke-light">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-smoke/20 border border-smoke/40 rounded p-6">
          <p className="text-smoke-light text-sm uppercase tracking-wide mb-2">
            Total Products
          </p>
          <p className="font-display text-3xl text-brass">
            {stats.totalProducts}
          </p>
        </div>
        <div className="bg-smoke/20 border border-smoke/40 rounded p-6">
          <p className="text-smoke-light text-sm uppercase tracking-wide mb-2">
            Total Categories
          </p>
          <p className="font-display text-3xl text-brass">
            {stats.totalCategories}
          </p>
        </div>
        <div className="bg-smoke/20 border border-smoke/40 rounded p-6">
          <p className="text-smoke-light text-sm uppercase tracking-wide mb-2">
            Total Orders
          </p>
          <p className="font-display text-3xl text-brass">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-smoke/20 border border-smoke/40 rounded p-6">
          <p className="text-smoke-light text-sm uppercase tracking-wide mb-2">
            Total Revenue
          </p>
          <p className="font-display text-3xl text-brass">
            Rs. {stats.totalRevenue.toLocaleString("en-PK")}
          </p>
        </div>
      </div>

      <div className="bg-smoke/20 border border-smoke/40 rounded p-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-xl text-ivory">Homepage Slider</h2>
          <button
            type="button"
            onClick={handleSliderReset}
            className="px-4 py-2 border border-brass/30 text-ivory rounded hover:border-brass hover:text-brass transition-colors"
          >
            Reset to default
          </button>
        </div>

        <label className="block w-full cursor-pointer rounded border border-dashed border-brass/30 bg-ink-soft p-4 text-sm text-smoke-light hover:border-brass hover:text-brass transition-colors">
          <span>{savingSlider ? "Uploading..." : "Upload slider image"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleSliderUpload} />
        </label>

        {slider.length ? (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {slider.map((slide, index) => (
              <div key={`${slide.src}-${index}`} className="relative overflow-hidden rounded border border-smoke/30 bg-ink-soft">
                <img src={slide.src} alt={slide.alt} className="h-28 w-full object-cover" />
                {slide._id && (
                  <button
                    type="button"
                    onClick={() => handleSliderRemove(slide._id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-oxblood text-xs font-bold text-ivory hover:bg-red-600"
                    aria-label={`Remove slider image ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-smoke-light">No custom slider data saved yet. The default slides will appear automatically.</p>
        )}

        {sliderMessage && (
          <p className="mt-4 text-sm text-brass">{sliderMessage}</p>
        )}
      </div>

      <div className="bg-smoke/20 border border-smoke/40 rounded p-6">
        <h2 className="font-display text-xl text-ivory mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 bg-brass/10 border border-brass/30 rounded hover:bg-brass/20 transition-colors text-ivory"
          >
            Manage Products
          </a>
          <a
            href="/admin/categories"
            className="p-4 bg-brass/10 border border-brass/30 rounded hover:bg-brass/20 transition-colors text-ivory"
          >
            Manage Categories
          </a>
          <a
            href="/admin/orders"
            className="p-4 bg-brass/10 border border-brass/30 rounded hover:bg-brass/20 transition-colors text-ivory"
          >
            View Orders
          </a>
        </div>
      </div>
    </div>
  );
}
