import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, jobPosition, education, location, expertise, verified } = body;

    if (!jobPosition || !education || !location || !expertise) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 },
      );
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authorized - No token provided." },
        { status: 401 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/alumni-details`,
      {
        id,
        jobPosition,
        education,
        location,
        expertise,
        verified,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Alumni details submission error:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Alumni details submission failed.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
