import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Not authorized - No token" },
        { status: 401 },
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
      { headers: { Authorization: authHeader } },
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
