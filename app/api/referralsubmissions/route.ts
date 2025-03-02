import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to submit." },
        { status: 401 },
      );
    }

    const data = await req.json();
    const { referralId, resumeLink, coverLetter, whyReferMe } = data;

    // Validation checks
    if (!referralId || !resumeLink || !coverLetter || !whyReferMe) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const urlPattern = /^https?:\/\/\S+$/;
    if (!urlPattern.test(resumeLink)) {
      return NextResponse.json(
        { message: "Please provide a valid URL for the resume" },
        { status: 400 },
      );
    }

    if (coverLetter.split(" ").length > 2000) {
      return NextResponse.json(
        { message: "Cover letter exceeds 2000 words limit" },
        { status: 400 },
      );
    }

    if (whyReferMe.split(" ").length > 5000) {
      return NextResponse.json(
        { message: "Why Refer Me section exceeds 5000 words limit" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/submissions`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error submitting referral:",
      error?.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to submit referral",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
