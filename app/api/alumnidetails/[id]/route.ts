import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authorized - No token provided." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { id: alumniId } = await context.params;

    if (!alumniId) {
      return NextResponse.json(
        { message: "Alumni ID is required" },
        { status: 400 },
      );
    }

    // Remove `id` and `verified` from the update data
    const { id, verified, ...updateData } = body;

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/alumni-details/${alumniId}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error updating alumni details:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to update alumni details.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
