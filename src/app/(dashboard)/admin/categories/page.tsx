"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string;
  productCount: number;
};

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Men", image: "/categories/men.jpg", productCount: 18 },
  { id: "2", name: "Women", image: "/categories/women.jpg", productCount: 14 },
  { id: "3", name: "Unisex", image: "/categories/unisex.jpg", productCount: 9 },
  { id: "4", name: "Travel Set", image: "/categories/travel-set.jpg", productCount: 6 },
  { id: "5", name: "Testers", image: "/categories/testers.jpg", productCount: 22 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), image: "/categories/placeholder.jpg", productCount: 0 },
    ]);
    setNewName("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-smoke-light font-body">
            {categories.length} categories
          </p>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brass text-ink text-sm font-body uppercase tracking-wide hover:bg-brass-light transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="flex items-end gap-4 bg-ink-soft border border-brass/15 p-5"
          >
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="newCategory" className="text-xs uppercase tracking-wide text-smoke font-body">
                Category Name
              </label>
              <input
                id="newCategory"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Limited Edition"
                autoFocus
                className="bg-ink border border-brass/20 px-4 py-2.5 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brass text-ink text-sm font-body uppercase tracking-wide hover:bg-brass-light transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Cancel"
              className="p-2.5 text-smoke hover:text-brass transition-colors"
            >
              <X size={18} />
            </button>
          </form>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative flex flex-col gap-3 bg-ink-soft border border-brass/10 p-4"
            >
              <div className="relative aspect-[4/3] w-full bg-ink overflow-hidden">
                <Image src={category.image} alt={category.name} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base text-ivory">{category.name}</h3>
                  <span className="text-xs text-smoke font-mono">{category.productCount} products</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button aria-label={`Edit ${category.name}`} className="text-smoke hover:text-brass transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button
                    aria-label={`Delete ${category.name}`}
                    onClick={() => handleDelete(category.id)}
                    className="text-smoke hover:text-oxblood-light transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}