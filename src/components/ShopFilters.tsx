"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FilterGroup = {
  label: string;
  options: string[];
};

const FILTER_GROUPS: FilterGroup[] = [
  { label: "Gender", options: ["Men", "Women", "Unisex"] },
  { label: "Concentration", options: ["Eau de Toilette", "Eau de Parfum", "Extrait"] },
  { label: "Price", options: ["Under Rs. 2,500", "Rs. 2,500 – 4,000", "Above Rs. 4,000"] },
];

function FilterAccordion({ group }: { group: FilterGroup }) {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (option: string) => {
    setChecked((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="border-b border-brass/15 pb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <span className="text-sm uppercase tracking-wide text-ivory font-body">
          {group.label}
        </span>
        <ChevronDown
          size={16}
          className={`text-smoke transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-3 mt-2">
          {group.options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 text-sm text-smoke-light font-body cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked.includes(option)}
                onChange={() => toggle(option)}
                className="w-4 h-4 accent-brass bg-transparent border border-brass/40"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopFilters() {
  return (
    <aside className="flex flex-col gap-2 py-2">
      <span className="eyebrow mb-4">Refine</span>
      {FILTER_GROUPS.map((group) => (
        <FilterAccordion key={group.label} group={group} />
      ))}
    </aside>
  );
}