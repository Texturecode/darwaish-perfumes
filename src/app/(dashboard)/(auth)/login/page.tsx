"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import BurnDivider from "@/components/BurnDivider";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Wire this up to your real auth endpoint
      await new Promise((r) => setTimeout(r, 800)); // placeholder
    } catch {
      setError("Invalid email or password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="font-display text-3xl text-ivory">
            <img src="/logo.PNG" alt="Darwaish Perfumes" className="h-32 w-full" />
          </Link>
          <BurnDivider className="w-20" />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-2xl text-ivory">Sign in to your account</h1>
          <p className="text-sm text-smoke-light font-body">
            Manage your orders, addresses, and saved fragrances.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="border border-oxblood/60 bg-oxblood/10 px-4 py-3">
              <p className="text-sm text-ivory font-body">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-smoke font-body">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-transparent border border-brass/30 px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs uppercase tracking-wide text-smoke font-body">
                Password
              </label>
              <Link href="/account/recover" className="text-xs text-smoke hover:text-brass transition-colors font-body">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent border border-brass/30 px-4 py-3 pr-11 text-sm text-ivory placeholder:text-smoke focus:outline-none focus:border-brass transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-brass transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-8 py-3 bg-brass text-ink font-body text-sm uppercase tracking-wide hover:bg-brass-light disabled:bg-smoke disabled:text-ink-soft disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

      </div>
    </main>
  );
}