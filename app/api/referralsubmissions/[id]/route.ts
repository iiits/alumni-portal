import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/submissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to fetch submissions",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { status } = data;

    // Validate status value
    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value. Must be 'accepted' or 'rejected'" },
        { status: 400 },
      );
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/submissions/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to update submission status",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
