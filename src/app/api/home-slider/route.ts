import { connectDB } from "@/config/mongodb";
import HomeSlider from "@/models/HomeSlider";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/api-auth";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const defaultSlides = [
  { src: "/hero.PNG", alt: "Hero Product 1" },
  { src: "/hero2.PNG", alt: "Hero Product 2" },
];

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "homepage-slider",
  });

  return result.secure_url;
}

export async function GET() {
  try {
    await connectDB();

    const slides = await HomeSlider.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: slides.length ? slides.map((slide) => ({
          _id: slide._id,
          src: slide.src,
          alt: slide.alt || "Homepage slider image",
          title: slide.title || "",
          subtitle: slide.subtitle || "",
        })) : defaultSlides,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Home slider fetch error:", error);
    return NextResponse.json(
      {
        success: true,
        data: defaultSlides,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const formData = await request.formData();
    const files = formData.getAll("images").filter((file): file is File => file instanceof File);

    if (!files.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const file = files[0];

    await connectDB();

    const uploadedUrl = await uploadToCloudinary(file);

    const savedSlides = await HomeSlider.insertMany([
      {
        src: uploadedUrl,
        alt: `Homepage slider image ${Date.now()}`,
        order: await HomeSlider.countDocuments({ isActive: true }),
        isActive: true,
      },
    ]);

    const slides = savedSlides.map((slide) => ({
      _id: slide._id,
      src: slide.src,
      alt: slide.alt,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
    }));

    return NextResponse.json(
      { success: true, data: slides },
      { status: 201 }
    );
  } catch (error) {
    console.error("Home slider upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload slider image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectDB();

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await HomeSlider.findByIdAndDelete(id);

      const remaining = await HomeSlider.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();

      return NextResponse.json(
        {
          success: true,
          data: remaining.map((slide) => ({
            _id: slide._id,
            src: slide.src,
            alt: slide.alt || "Homepage slider image",
          })),
          deleted: !!deleted,
        },
        { status: 200 }
      );
    }

    await HomeSlider.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: defaultSlides,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Home slider reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset slider images" },
      { status: 500 }
    );
  }
}
