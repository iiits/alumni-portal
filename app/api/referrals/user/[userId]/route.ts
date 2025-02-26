import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }, // Ensure params is awaited
) {
  try {
    // Await params before extracting userId
    const { userId } = await context.params;

    // Extract token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view referrals." },
        { status: 401 },
      );
    }

    // Send request to backend API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error fetching user referrals:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to fetch user referrals",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
