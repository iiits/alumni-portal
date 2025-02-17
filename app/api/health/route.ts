import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/health`,
    );

    return NextResponse.json({
      status: response.status,
      message: "Service is healthy",
      data: response.data,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Health check failed", error },
      { status: 500 },
    );
  }
}
