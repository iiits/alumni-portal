import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type");
    const workType = searchParams.get("workType");
    const batch = searchParams.get("batch");

    if (
      month &&
      (!/^\d+$/.test(month) || Number(month) < 1 || Number(month) > 12)
    ) {
      return NextResponse.json(
        { message: "Invalid month value." },
        { status: 400 },
      );
    }

    if (year && (!/^\d{4}$/.test(year) || Number(year) < 2000)) {
      return NextResponse.json(
        { message: "Invalid year value." },
        { status: 400 },
      );
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to view job postings." },
        { status: 401 },
      );
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/filter`;
    const queryParams = new URLSearchParams();

    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);
    if (type) queryParams.append("type", type);
    if (workType) queryParams.append("workType", workType);
    if (batch) queryParams.append("batch", batch);

    const apiUrl = `${baseUrl}?${queryParams.toString()}`;

    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
