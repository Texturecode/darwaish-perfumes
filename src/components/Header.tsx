"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/collections/men" },
//   { label: "Women", href: "/collections/women" },
//   { label: "Unisex", href: "/collections/unisex" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-ink/95 backdrop-blur-sm border-b border-brass/20">
      {/* Announcement strip */}
      <div className="bg-oxblood text-ivory text-center text-xs font-mono uppercase tracking-widest2 py-2 px-4">
        Free delivery across Pakistan on orders over Rs. 4,000
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <button
            className="lg:hidden text-ivory"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className=""
          >
            <img src="/logo.PNG" alt="Darwaish Perfumes" className="h-20 w-full" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm uppercase tracking-wide text-smoke hover:text-brass transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-ivory hover:text-brass transition-colors">
              <Search size={20} />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative text-ivory hover:text-brass transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brass text-ink text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute h-96 inset-0 z-50 bg-ink/98  flex flex-col px-8 py-6">
          <button
            className="self-end text-ivory mb-10"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <nav className="flex flex-col gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl text-ivory hover:text-brass transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
