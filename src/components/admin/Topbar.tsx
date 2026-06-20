"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur-sm border-b border-brass/10">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="font-display text-lg text-ivory">{title}</h1>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2 bg-ink-soft border border-brass/15 px-3 py-1.5">
            <Search size={14} className="text-smoke" />
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent text-sm text-ivory placeholder:text-smoke focus:outline-none w-40"
            />
          </div>

          <button aria-label="Notifications" className="relative text-smoke-light hover:text-brass transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-oxblood-light" />
          </button>

          <div className="w-8 h-8 rounded-full bg-brass/20 border border-brass/40 flex items-center justify-center font-mono text-xs text-brass">
            DA
          </div>
        </div>
      </div>
    </header>
  );
}