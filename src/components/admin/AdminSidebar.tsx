"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-ink-soft border-r border-brass/10">
      <div className="px-6 py-6">
        <Link href="/admin" className="font-display text-xl text-ivory">
          Darwaish
        </Link>
        <span className="block text-[10px] uppercase tracking-widest2 text-smoke font-mono mt-1">
          Admin
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 mt-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body transition-colors ${
                active
                  ? "bg-brass/10 text-brass border-l-2 border-brass -ml-px"
                  : "text-smoke-light hover:text-ivory hover:bg-ink"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}