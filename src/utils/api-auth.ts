import { getUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { error: false, user };
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return {
      error: true,
      response: NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { error: false, user };
}
