import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Identifier and password are required." },
        { status: 400 },
      );
    }

    // Call the backend API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        identifier,
        password,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Login failed.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
