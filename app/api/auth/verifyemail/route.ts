import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 },
      );
    }

    // Call backend API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
      { token },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error verifying email:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Internal Server Error",
      },
      { status: error.response?.status || 500 },
    );
  }
}
