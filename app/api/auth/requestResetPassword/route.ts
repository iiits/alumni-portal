import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-reset-password`,
      { email },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error requesting password reset:",
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
