import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await req.json();
    const { email, name, subject, message } = body;

    // Check if all required fields are provided
    if (!email || !name || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    // Call the external backend API (if this is necessary)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/contactus`,
      {
        email,
        name,
        subject,
        message,
      },
    );

    // Return the response from the external API
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Contact form submission error:",
      error.response?.data || error.message,
    );

    // Handle errors: if axios error, use axios response, otherwise use a fallback error message
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to submit contact form.",
      },
      { status: error.response?.status || 500 },
    );
  }
}
