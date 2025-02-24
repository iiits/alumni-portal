import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, jobPosition, education, location, expertise, verified } = body;

    // Check for required fields
    if (!id || !jobPosition || !education || !location || !expertise) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 },
      );
    }

    // Extract token from request headers
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Not authorized - No token provided." },
        { status: 401 },
      );
    }

    // Call the backend API with authentication
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
          Authorization: authHeader, // Include token in request headers
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
