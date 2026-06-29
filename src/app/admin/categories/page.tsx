"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat._id !== id));
      } else {
        setError("Failed to delete category");
      }
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    }
  };

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          description: categoryDescription.trim(),
          image: categoryImage.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error || "Failed to create category");
        return;
      }

      setCategories((prev) => [...prev, json.data]);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage("");
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-ivory">Categories</h1>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brass text-ink rounded font-semibold hover:bg-brass-light transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-ink p-6 border border-smoke/20 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-ivory">Add New Category</h2>
                <p className="text-sm text-smoke mt-1">Create a category without leaving this page.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-smoke hover:text-ivory"
              >
                Close
              </button>
            </div>

            {submitError && (
              <div className="mb-4 rounded-lg bg-red-900/20 border border-red-500/50 p-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm text-smoke">
                  Category Name
                  <input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory focus:outline-none focus:border-brass transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-smoke">
                  Description
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                    className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory focus:outline-none focus:border-brass transition-colors resize-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-smoke">
                  Image URL (optional)
                  <input
                    value={categoryImage}
                    onChange={(e) => setCategoryImage(e.target.value)}
                    className="bg-ink-soft border border-brass/20 px-4 py-3 text-sm text-ivory focus:outline-none focus:border-brass transition-colors"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-smoke/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full border border-smoke/20 px-5 py-2 text-sm text-smoke hover:border-brass hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-ink hover:bg-brass-light transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-smoke-light">Loading categories...</div>
      ) : (
        <div className="bg-smoke/20 border border-smoke/40 rounded overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-smoke/40">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-smoke/20 hover:bg-smoke/10">
                  <td className="px-6 py-4 text-smoke-light">{category.name}</td>
                  <td className="px-6 py-4 text-smoke-light">{category.slug}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/admin/categories/${category._id}`}>
                      <button className="p-2 hover:bg-smoke/20 rounded transition-colors text-brass">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 hover:bg-smoke/20 rounded transition-colors"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
