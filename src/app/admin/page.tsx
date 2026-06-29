"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        if (data.success) {
          setStats({
            totalProducts: data.data.totalProducts || 0,
            totalCategories: data.data.totalCategories || 0,
            totalOrders: data.data.totalOrders || 0,
            totalRevenue: data.data.recentOrders?.reduce(
              (sum: number, order: any) => sum + (order.total || 0),
              0
            ) || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
