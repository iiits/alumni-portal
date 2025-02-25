import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authorized - No token provided." },
        { status: 401 },
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to fetch user profile.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
