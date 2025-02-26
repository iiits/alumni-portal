import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view referrals." },
        { status: 401 },
      );
    }

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
