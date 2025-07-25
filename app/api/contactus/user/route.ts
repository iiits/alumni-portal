import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Get user's previous contact form queries
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/contactus/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error retrieving contact form history:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: "Failed to retrieve contact form history",
        error: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
