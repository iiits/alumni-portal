import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract search parameters from request URL
    const { searchParams } = new URL(req.url);
    let month = searchParams.get("month");
    let year = searchParams.get("year");

    // Validate month (should be between 1-12)
    if (
      month &&
      (!/^\d+$/.test(month) || Number(month) < 1 || Number(month) > 12)
    ) {
      return NextResponse.json(
        { message: "Invalid month value." },
        { status: 400 },
      );
    }

    // Validate year (should be a valid 4-digit number)
    if (year && (!/^\d{4}$/.test(year) || Number(year) < 2000)) {
      return NextResponse.json(
        { message: "Invalid year value." },
        { status: 400 },
      );
    }

    // Extract token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view referrals." },
        { status: 401 },
      );
    }

    // Construct API URL
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/filter`;
    const queryParams = new URLSearchParams();

    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);

    const apiUrl = `${baseUrl}?${queryParams.toString()}`;

    // Fetch referrals from backend
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error fetching referrals:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to fetch referrals.",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
