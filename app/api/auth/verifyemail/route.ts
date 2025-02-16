import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    // Call the backend API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyemail`, { token });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error verifying email:", error.response?.data || error.message);
    return NextResponse.json({
      message: error.response?.data?.message || "Internal Server Error",
    }, { status: error.response?.status || 500 });
  }
}
