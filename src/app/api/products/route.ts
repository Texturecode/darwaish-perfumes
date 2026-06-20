import { connectDB } from "@/config/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Hello from Next.js API",
    success: true,
  });
}

// export async function POST(request: Request) {
//   const data = await request.json();


//   connectDB();

//   Product.create(data)
//     .then((createdProduct) => {
//       console.log("Product created successfully:", createdProduct);
//     })
//     .catch((error) => {
//       console.error("Error creating product:", error);
//     });



//   return NextResponse.json({
//     message: "Data received successfully",
//     success: true,
//     receivedData: data,
//   });
// }

export async function PUT(request: Request) {
  const data = await request.json();
  console.log("Received data for update:", data);

  return NextResponse.json({
    message: "Data updated successfully",
    success: true,
    updatedData: data,
  });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  console.log("Received data for deletion:", data);

  return NextResponse.json({
    message: "Data deleted successfully",
    success: true,
    deletedData: data,
  });
}