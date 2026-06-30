import { connectDB } from "@/config/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/api-auth";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ProductStatus = "Draft" | "Active" | "Sold Out";
const VALID_STATUSES: ProductStatus[] = ["Draft", "Active", "Sold Out"];

type Concentrations = "Eau de Toilette" | "Eau de Parfum" | "Extrait de Parfum" | "Attar"

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "products",
  });

  return result.secure_url;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "Active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build filter query
    const filter: any = { status };

    if (category && Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
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
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const notes = formData.get("notesLine")?.toString() || "";
    const rawConcentration = formData.get("concentration")?.toString() || "";
     const concentration: Concentrations = rawConcentration as Concentrations
    const sku = formData.get("sku")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const compareAtPrice = formData.get("compareAtPrice")?.toString() || "";
    const stock = formData.get("stock")?.toString() || "";
    const rawStatus = formData.get("status")?.toString() || "";
    const status: ProductStatus = VALID_STATUSES.includes(rawStatus as ProductStatus)
      ? (rawStatus as ProductStatus)
      : "Draft";

    let fragranceNotes = { top: [], middle: [], base: [] };
    const fragranceNotesRaw = formData.get("fragranceNotes")?.toString();
    if (fragranceNotesRaw) {
      try {
        fragranceNotes = JSON.parse(fragranceNotesRaw);
      } catch {
        return NextResponse.json(
          { error: "Invalid fragranceNotes format" },
          { status: 400 }
        );
      }
    }

    // Already-hosted image URLs (e.g. a fallback default), sent as plain strings
    const existingImageUrls = formData.getAll("existingImages").map((v) => v.toString());

    // New files that need uploading
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);

    // Validate required fields before touching Cloudinary
    if (!name || !category || (!files.length && !existingImageUrls.length) || !price) {
      return NextResponse.json(
        { error: "Name, category, images, and price are required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Use JPEG, PNG, WEBP, or GIF.` },
          { status: 400 }
        );
      }
      // if (file.size > MAX_FILE_SIZE) {
      //   return NextResponse.json(
      //     { error: `File too large: ${file.name}. Max size is 5MB.` },
      //     { status: 400 }
      //   );
      // }
    }

    // Upload all new files to Cloudinary in parallel
    let uploadedUrls: string[] = [];
    if (files.length) {
      const results = await Promise.allSettled(files.map(uploadToCloudinary));
      const failed = results.filter((r) => r.status === "rejected");

      if (failed.length) {
        console.error("Some image uploads failed:", failed);
        return NextResponse.json(
          { error: "One or more images failed to upload. Please try again." },
          { status: 500 }
        );
      }

      uploadedUrls = (results as PromiseFulfilledResult<string>[]).map((r) => r.value);
    }

    const images = [...existingImageUrls, ...uploadedUrls];

    if (!images.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      name: name.trim(),
      category,
      description,
      notes,
      fragranceNotes,
      concentration,
      sku: sku?.toUpperCase() || "",
      images,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      stock: parseInt(stock) || 0,
      status
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const body = await request.json();
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}