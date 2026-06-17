export type Product = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  description?: string;
  fragranceNotes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  concentration?: string; // e.g. "20% — Eau de Parfum"
  sku?: string;
  notes?: string; // e.g. "Inspired by Bleu de Chanel" — fragrance lineage, no boxed card needed
  price: number;
  compareAtPrice?: number; // present if on sale
  rating?: number;
  reviewCount?: number;
  soldOut?: boolean;
};

export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}
