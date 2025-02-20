import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, message } = body;
    const token = req.cookies.get("token")?.value;

    if (!subject || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/contactus`,
      {
        subject,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json({
      status: response.status,
      message: "Contact form submitted successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.error(
      "Contact form submission error:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: "Contact form submission failed",
        error: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
