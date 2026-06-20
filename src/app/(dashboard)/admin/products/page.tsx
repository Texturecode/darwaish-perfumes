import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, MoreVertical } from "lucide-react";
// import StatusBadge from "@/components/admin/StatusBadge";
import { formatPKR } from "@/components/types";

type AdminProduct = {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Sold Out";
};

// Replace with a real fetch from your product source
const PRODUCTS: AdminProduct[] = [
  { id: "1", name: "Signature Black", image: "/products/signature-black.jpg", category: "Men", price: 3199, stock: 42, status: "Active" },
  { id: "2", name: "Signature Gold", image: "/products/signature-gold.jpg", category: "Men", price: 3000, stock: 18, status: "Active" },
  { id: "5", name: "Oud Al Sultan", image: "/products/oud-al-sultan.jpg", category: "Unisex", price: 3000, stock: 0, status: "Sold Out" },
  { id: "8", name: "Mirage", image: "/products/mirage.jpg", category: "Women", price: 3000, stock: 6, status: "Active" },
  { id: "11", name: "Winter Oud Reserve", image: "/products/winter-oud.jpg", category: "Unisex", price: 4500, stock: 0, status: "Draft" },
];

function statusTone(status: AdminProduct["status"]) {
  if (status === "Active") return "success" as const;
  if (status === "Sold Out") return "danger" as const;
  return "neutral" as const;
}

export default function AdminProductsPage() {
  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-smoke-light font-body">
            {PRODUCTS.length} products in your catalog
          </p>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-brass text-ink text-sm font-body uppercase tracking-wide hover:bg-brass-light transition-colors"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>

        <div className="bg-ink-soft border border-brass/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brass/10 text-left">
                <th className="px-5 py-3 font-body text-xs uppercase tracking-wide text-smoke">Product</th>
                <th className="px-5 py-3 font-body text-xs uppercase tracking-wide text-smoke">Category</th>
                <th className="px-5 py-3 font-body text-xs uppercase tracking-wide text-smoke">Price</th>
                <th className="px-5 py-3 font-body text-xs uppercase tracking-wide text-smoke">Stock</th>
                <th className="px-5 py-3 font-body text-xs uppercase tracking-wide text-smoke">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((product) => (
                <tr key={product.id} className="border-b border-brass/5 last:border-0 hover:bg-ink/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-ink shrink-0 overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="text-ivory font-body">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-smoke-light font-body">{product.category}</td>
                  <td className="px-5 py-3 text-ivory font-mono">{formatPKR(product.price)}</td>
                  <td className="px-5 py-3 font-mono">
                    <span className={product.stock === 0 ? "text-oxblood-light" : "text-smoke-light"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {/* <StatusBadge status={product.status} tone={statusTone(product.status)} /> */}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className="text-smoke hover:text-brass transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button aria-label="More actions" className="text-smoke hover:text-brass transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}