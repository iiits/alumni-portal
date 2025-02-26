import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view events." },
        { status: 401 },
      );
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/events/filter`;
    const queryParams = new URLSearchParams();

    if (year) queryParams.append("year", year);
    if (type) queryParams.append("type", type);

    const apiUrl = `${baseUrl}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error fetching events:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to fetch events.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
