"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  isFeatured: boolean
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotal(data.pagination.total);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        setError("Failed to delete product");
      }
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    }
  };

  const handleClickFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'applciation/json'},
        body: JSON.stringify({ isFeatured })
      })

    } catch (error) {
        console.log(error)
    } 
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-ivory">Products</h1>
        <Link href="/admin/products/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-brass text-ink rounded font-semibold hover:bg-brass-light transition-colors">
            <Plus size={20} />
            Add Product
          </button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-smoke-light">Loading products...</div>
      ) : (
        <div className="bg-smoke/20 border border-smoke/40 rounded overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-smoke/40">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-smoke/20 hover:bg-smoke/10">
                  <td className="px-6 py-4 text-smoke-light">{product.name}</td>
                  <td className="px-6 py-4 text-smoke-light">
                    Rs. {product.price.toLocaleString("en-PK")}
                  </td>
                  <td className="px-6 py-4 text-smoke-light">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${product.status === "Active"
                          ? "bg-green-900/30 text-green-300"
                          : product.status === "Draft"
                            ? "bg-yellow-900/30 text-yellow-300"
                            : "bg-red-900/30 text-red-300"
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <button className="p-2 hover:bg-smoke/20 rounded transition-colors">
                        <Edit2 size={18} className="text-brass" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 hover:bg-smoke/20 rounded transition-colors"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                    {product?.isFeatured ? <button type="button" className="bg-red-600/30 text-red-700 text-xs px-4" onClick={() => handleClickFeatured(product._id, false)}>Remove Featured</button> : <button type="button" className="text-xs bg-green-600/10 px-4 text-green-700" onClick={() => handleClickFeatured(product._id, true)}>Make Featured</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 20 && (
        <div className="mt-8 flex justify-between items-center">
          <p className="text-smoke-light">
            Showing page {page} of {Math.ceil(total / 20)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-smoke/20 rounded text-ivory disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage(Math.min(Math.ceil(total / 20), page + 1))
              }
              disabled={page >= Math.ceil(total / 20)}
              className="px-4 py-2 bg-smoke/20 rounded text-ivory disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
