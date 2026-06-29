import { connectDB } from "@/config/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/auth";
import { Types } from "mongoose";

// GET user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ userId: user.userId })
      .populate("items.productId", "name slug price images")
      .lean();

    if (!cart) {
      cart = { items: [] };
    }

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// Add or update item in cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify product exists and get price
    const product = await Product.findById(productId).select("price");
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
        cart = new Cart({ userId: user.userId, items: [] });
        console.log("New cart created", cart)
    }

    // Check if item already exists
    const existingItem = cart?.items?.find(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart?.items?.push({
        productId: new Types.ObjectId(productId),
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.productId", "name slug price images");

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const item = cart.items.find(
      (item: any) => item.productId.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items = cart.items.filter(
        (item: any) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId", "name slug price images");

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId", "name slug price images");

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
