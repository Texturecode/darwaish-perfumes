"use client";

import { useState } from "react";
import Link from "next/link";
// import { Facebook, Instagram } from "lucide-react";
import BurnDivider from "./BurnDivider";

const QUICK_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Unisex", href: "/collections/unisex" },
  { label: "Travel Set", href: "/collections/travel-set" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire this up to your email provider (Klaviyo, Mailchimp, etc.)
    setSubmitted(true);
  };

  return (
    <footer className="bg-ink-soft pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-3 gap-12 pb-16">
          <div className="flex flex-col gap-4">
            <span className="font-display text-2xl text-ivory">Darwaish</span>
            <p className="text-sm text-smoke-light font-body max-w-xs leading-relaxed">
              Fragrances for men and women, blended with ethically sourced
              oud, attar, and a concentration built to last.
            </p>
            {/* <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="text-smoke hover:text-brass transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-smoke hover:text-brass transition-colors">
                <Instagram size={18} />
              </a>
            </div> */}
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">Quick Menu</span>
            <nav className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-smoke-light hover:text-brass transition-colors font-body w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">Subscribe</span>
            <p className="text-sm text-smoke-light font-body max-w-xs">
              New arrivals and seasonal drops, delivered occasionally — never
              spammed.
            </p>
            {submitted ? (
              <p className="text-sm text-brass font-body">
                You&apos;re on the list. Welcome.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 bg-transparent border border-brass/30 px-4 py-2 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brass text-ink text-sm font-body uppercase tracking-wide hover:bg-brass-light transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <BurnDivider className="w-full" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-8 text-xs text-smoke font-body">
          <span>© {new Date().getFullYear()} Darwaish Perfumes. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/policies/privacy-policy" className="hover:text-brass transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies/refund-policy" className="hover:text-brass transition-colors">
              Refund Policy
            </Link>
            <Link href="/policies/terms-of-service" className="hover:text-brass transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
