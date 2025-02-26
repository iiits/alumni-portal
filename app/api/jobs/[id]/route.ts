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
        { message: "Unauthorized. Please login to update the job posting." },
        { status: 401 },
      );
    }

    const data = await req.json();
    const { id } = await context.params;
    const jobId = id;

    // Validate required fields only if they are present
    if (
      data.type &&
      !["fulltime", "parttime", "internship", "others"].includes(data.type)
    ) {
      return NextResponse.json(
        {
          message:
            "Type must be either 'fulltime', 'parttime', 'internship', or 'others'",
        },
        { status: 400 },
      );
    }

    if (
      data.workType &&
      !["onsite", "remote", "hybrid"].includes(data.workType)
    ) {
      return NextResponse.json(
        { message: "WorkType must be either 'onsite', 'remote', or 'hybrid'" },
        { status: 400 },
      );
    }

    if (data.links && (!Array.isArray(data.links) || data.links.length === 0)) {
      return NextResponse.json(
        { message: "Links must be a non-empty array" },
        { status: 400 },
      );
    }

    // URL pattern validation if links are present
    if (data.links) {
      const urlPattern = /^https?:\/\/\S+$/;
      if (!data.links.every((link: string) => urlPattern.test(link))) {
        return NextResponse.json(
          { message: "Please provide valid URLs for all links" },
          { status: 400 },
        );
      }
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
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
      "Error updating job posting:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to update job posting",
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
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to delete the job posting." },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const jobId = id;

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Error deleting job posting:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to delete job posting",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
