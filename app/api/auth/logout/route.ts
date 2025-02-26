import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );

    // Clear the HTTP-only cookie
    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
