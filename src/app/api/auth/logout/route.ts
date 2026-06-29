import { clearAuthCookie } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
