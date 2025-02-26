import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to create a referral." },
        { status: 401 },
      );
    }

    const data = await req.json();

    const { jobDetails, lastApplyDate, numberOfReferrals } = data;

    if (
      !jobDetails ||
      !jobDetails.title ||
      !jobDetails.description ||
      !jobDetails.company ||
      !jobDetails.role ||
      !jobDetails.link ||
      !lastApplyDate ||
      numberOfReferrals === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (typeof numberOfReferrals !== "number" || numberOfReferrals < 0) {
      return NextResponse.json(
        { message: "Number of referrals must be a non-negative number" },
        { status: 400 },
      );
    }

    const urlPattern = /^https?:\/\/\S+$/;
    if (!urlPattern.test(jobDetails.link)) {
      return NextResponse.json(
        { message: "Please provide a valid URL for the job link" },
        { status: 400 },
      );
    }

    const applyDate = new Date(lastApplyDate);
    const currentDate = new Date();
    if (applyDate <= currentDate) {
      return NextResponse.json(
        { message: "Last apply date must be in the future" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals`,
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
      "Error creating referral:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to create referral",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
