import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const userID = id;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view job postings." },
        { status: 401 },
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/user/${userID}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error fetching job postings:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to fetch job postings.",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
