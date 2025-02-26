import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to create a job posting." },
        { status: 401 },
      );
    }

    const data = await req.json();

    const {
      jobName,
      company,
      role,
      eligibility,
      description,
      type,
      stipend,
      duration,
      workType,
      links,
      lastApplyDate,
    } = data;

    if (
      !jobName ||
      !company ||
      !role ||
      !description ||
      !type ||
      !stipend ||
      !duration ||
      !workType ||
      !links ||
      !lastApplyDate ||
      !eligibility.requirements ||
      !eligibility.batch
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Type validation
    if (!["fulltime", "parttime", "internship", "others"].includes(type)) {
      return NextResponse.json(
        {
          message:
            "Type must be either 'fulltime', 'parttime', 'internship', or 'others'",
        },
        { status: 400 },
      );
    }

    // WorkType validation
    if (!["onsite", "remote", "hybrid"].includes(workType)) {
      return NextResponse.json(
        { message: "WorkType must be either 'onsite', 'remote', or 'hybrid'" },
        { status: 400 },
      );
    }

    // Requirements validation
    if (
      !Array.isArray(eligibility.requirements) ||
      eligibility.requirements.length === 0
    ) {
      return NextResponse.json(
        { message: "Eligibility requirements must be a non-empty array" },
        { status: 400 },
      );
    }

    // Batch validation
    if (!Array.isArray(eligibility.batch) || eligibility.batch.length === 0) {
      return NextResponse.json(
        { message: "Eligibility batch must be a non-empty array" },
        { status: 400 },
      );
    }

    // Links validation
    if (!Array.isArray(links) || links.length === 0) {
      return NextResponse.json(
        { message: "Links must be a non-empty array" },
        { status: 400 },
      );
    }

    // URL pattern validation
    const urlPattern = /^https?:\/\/\S+$/;
    if (!links.every((link) => urlPattern.test(link))) {
      return NextResponse.json(
        { message: "Please provide valid URLs for all links" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
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
      "Error creating job posting:",
      error?.response?.data || error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to create job posting",
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
