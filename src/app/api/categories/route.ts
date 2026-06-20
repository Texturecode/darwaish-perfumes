import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();

        return NextResponse.json({
            message: "Data received successfully",
            success: true,
            data,
        })
}