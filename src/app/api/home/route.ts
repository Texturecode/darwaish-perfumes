import { connectDB } from "@/config/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

function mapProduct(product: any) {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    images: product.images?.length ? product.images : ["/products/blue-haven.PNG"],
    notes: product.notes,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldOut: product.status === "Sold Out",
  };
}

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ status: "Active" })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const signatureSeries = products.slice(0, 4).map(mapProduct);
    const featured = products.slice(4, 8).map(mapProduct);

    return NextResponse.json(
      {
        success: true,
        data: {
          signatureSeries,
          featured,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Home products error:", error);
    return NextResponse.json(
      { error: "Failed to load home products" },
      { status: 500 }
    );
  }
}
