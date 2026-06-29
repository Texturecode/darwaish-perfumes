import { connectDB } from "@/config/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/utils/api-auth";
import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.response;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("items.product", "name slug images price");

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check authorization: customer can only view their own orders
    const isAdmin = auth.user?.role === "admin";
    if (
      !isAdmin &&
      order.customer?._id.toString() !== auth.user?.userId
    ) {
      return NextResponse.json(
        { error: "Forbidden - Cannot view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true, runValidators: true }
    )
      .populate("customer", "name email phone")
      .populate("items.product", "name slug images price");

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
