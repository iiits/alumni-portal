import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let month = searchParams.get("month");
    let year = searchParams.get("year");

    if (
      month &&
      (!/^\d+$/.test(month) || Number(month) < 1 || Number(month) > 12)
    ) {
      return NextResponse.json(
        { message: "Invalid month value." },
        { status: 400 },
      );
    }

    if (year && !/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { message: "Invalid year value." },
        { status: 400 },
      );
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view referrals." },
        { status: 401 },
      );
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/filter`;
    const queryParams = new URLSearchParams();

    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);

    const apiUrl = `${baseUrl}?${queryParams.toString()}`;

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
