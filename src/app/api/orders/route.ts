import { connectDB } from "@/config/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/utils/api-auth";
import { Types } from "mongoose";
import Cart from "@/models/Cart";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.response;

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = auth.user?.role === "admin";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let query: any = {};

    // Non-admin users can only see their own orders
    if (!isAdmin) {
      query.customer = new Types.ObjectId(auth.user!.userId);
    } else if (searchParams.get("status")) {
      // Admin can filter by status
      query.status = searchParams.get("status");
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer", "name email phone")
        .populate("items.product", "name slug images price")
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.response;

    const body = await request.json();
    const {
      items,
      shippingAddress,
      subtotal,
      shippingFee = 0,
      total,
      notes,
      cart,
    } = body;

    // Validation
    if (!items?.length || !shippingAddress || !total) {
      return NextResponse.json(
        { error: "Items, shipping address, and total are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate that all products exist and have sufficient stock
    for (const item of items) {
      if (!Types.ObjectId.isValid(item.product._id)) {
        return NextResponse.json(
          { error: "Invalid product ID in items" },
          { status: 400 }
        );
      }
    }

    const order = await Order.create({
      customer: new Types.ObjectId(auth.user!.userId),
      items,
      shippingAddress,
      subtotal: parseFloat(subtotal),
      shippingFee: parseFloat(shippingFee),
      total: parseFloat(total),
      paymentMethod: "COD", // Cash on Delivery
      paymentStatus: "Unpaid",
      notes: notes || "",
      status: "Pending",
    });

    await Cart.deleteOne({ _id: cart.toString() })

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
