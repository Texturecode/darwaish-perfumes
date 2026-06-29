"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function ShopFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  search,
  onSearchChange,
}: ShopFiltersProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    category: true,
    price: true,
    search: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="flex flex-col gap-2 py-2">
      <span className="text-sm uppercase tracking-widest text-brass mb-4">
        Refine
      </span>

      {/* Search */}
      <div className="border-b border-brass/15 pb-5">
        <button
          onClick={() => toggleSection("search")}
          className="flex items-center justify-between w-full py-3 text-left"
        >
          <span className="text-sm uppercase tracking-wide text-ivory font-body">
            Search
          </span>
          <ChevronDown
            size={16}
            className={`text-smoke transition-transform ${
              openSections["search"] ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections["search"] && (
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 mt-2 bg-smoke border border-smoke-light rounded text-ivory text-sm placeholder:text-smoke-light focus:outline-none focus:border-ivory"
          />
        )}
      </div>

      {/* Category */}
      <div className="border-b border-brass/15 pb-5">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full py-3 text-left"
        >
          <span className="text-sm uppercase tracking-wide text-ivory font-body">
            Category
          </span>
          <ChevronDown
            size={16}
            className={`text-smoke transition-transform ${
              openSections["category"] ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections["category"] && (
          <div className="flex flex-col gap-3 mt-2">
            <label className="flex items-center gap-3 text-sm text-smoke-light font-body cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={() => onCategoryChange("")}
                className="w-4 h-4 accent-brass"
              />
              All Categories
            </label>
            {categories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-3 text-sm text-smoke-light font-body cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat._id}
                  checked={selectedCategory === cat._id}
                  onChange={() => onCategoryChange(cat._id)}
                  className="w-4 h-4 accent-brass"
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-brass/15 pb-5">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-3 text-left"
        >
          <span className="text-sm uppercase tracking-wide text-ivory font-body">
            Price
          </span>
          <ChevronDown
            size={16}
            className={`text-smoke transition-transform ${
              openSections["price"] ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections["price"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-smoke-light">
                Min Price: Rs. {minPrice.toLocaleString("en-PK")}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                value={minPrice}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= maxPrice) {
                    onPriceChange(newMin, maxPrice);
                  }
                }}
                className="w-full accent-brass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-smoke-light">
                Max Price: Rs. {maxPrice.toLocaleString("en-PK")}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                value={maxPrice}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  if (newMax >= minPrice) {
                    onPriceChange(minPrice, newMax);
                  }
                }}
                className="w-full accent-brass"
              />
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(selectedCategory || minPrice > 0 || maxPrice < 10000 || search) && (
        <button
          onClick={() => {
            onCategoryChange("");
            onPriceChange(0, 10000);
            onSearchChange("");
          }}
          className="mt-4 flex items-center gap-2 text-sm text-brass hover:text-ivory transition-colors"
        >
          <X size={16} />
          Clear All Filters
        </button>
      )}
    </aside>
  );
}