import { connectDB } from "@/config/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const [totalProducts, totalCategories, totalOrders, recentOrders] = await Promise.all([
      Product.countDocuments({}),
      Category.countDocuments({}),
      Order.countDocuments({}),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalProducts,
          totalCategories,
          totalOrders,
          recentOrders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
