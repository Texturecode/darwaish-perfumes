import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
    
  // Simulate fetching product data based on the ID
  const product = {
    id,
    name: `Product ${id}`,
    slug: `product-${id}`,
    images: [`/products/product-${id}.jpg`],
    price: 1000 + parseInt(id) * 100,
  };

  return NextResponse.json({
    message: "Product fetched successfully",
    success: true,
    product,
  });
}