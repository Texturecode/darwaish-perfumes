"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import BurnDivider from "@/components/BurnDivider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/shop";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          router.replace(nextUrl);
          return;
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, [nextUrl, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to login");
        setLoading(false);
        return;
      }

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(nextUrl);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
          {checkingAuth ? (
            <div className="p-4 bg-smoke border border-smoke-light rounded text-smoke-light text-center">
              Checking your session…
            </div>
          ) : null}

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-body text-smoke-light">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-body text-smoke-light">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-smoke-light/30 rounded text-ivory placeholder:text-smoke-light focus:outline-none focus:border-ivory"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke-light hover:text-ivory"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || checkingAuth}
            className="w-full px-4 py-3 bg-ivory text-ink font-body font-semibold rounded hover:bg-smoke-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-smoke-light font-body">
          Don't have an account?{" "}
          <Link href="/signup" className="text-ivory hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}