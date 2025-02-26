import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }, // Ensure params is awaited
) {
  try {
    // Await params before extracting id
    const { id } = await context.params;

    // Extract token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to delete a referral." },
        { status: 401 },
      );
    }

    // Send request to backend API
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error deleting referral:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to delete referral",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
