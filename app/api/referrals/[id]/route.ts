import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to update a referral." },
        { status: 401 },
      );
    }

    const data = await req.json();
    const { id } = await context.params;

    // Validate fields only if they are present
    if (data.jobDetails) {
      if (data.jobDetails.link) {
        const urlPattern = /^https?:\/\/\S+$/;
        if (!urlPattern.test(data.jobDetails.link)) {
          return NextResponse.json(
            { message: "Please provide a valid URL for the job link" },
            { status: 400 },
          );
        }
      }
    }

    if (data.lastApplyDate) {
      const applyDate = new Date(data.lastApplyDate);
      const currentDate = new Date();
      if (applyDate <= currentDate) {
        return NextResponse.json(
          { message: "Last apply date must be in the future" },
          { status: 400 },
        );
      }
    }

    if (data.numberOfReferrals !== undefined) {
      if (
        typeof data.numberOfReferrals !== "number" ||
        data.numberOfReferrals < 0
      ) {
        return NextResponse.json(
          { message: "Number of referrals must be a non-negative number" },
          { status: 400 },
        );
      }
    }

    if (data.isActive !== undefined) {
      if (typeof data.isActive !== "boolean") {
        return NextResponse.json(
          { message: "isActive must be a boolean value" },
          { status: 400 },
        );
      }
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/${id}`,
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
      "Error updating referral:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to update referral",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to delete a referral." },
        { status: 401 },
      );
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referrals/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error deleting referral:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to delete referral",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
