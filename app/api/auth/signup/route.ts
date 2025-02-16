import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, batch, department, collegeEmail, personalEmail, rollNumber, password } = body;

    // if (!name || !username || !batch || !department || !collegeEmail || !personalEmail || !rollNumber || !password) {
    //   return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    // }

    // Call the backend API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, body);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    return NextResponse.json({ message: error.response?.data?.message || "Signup failed." }, { status: error.response?.status || 500 });
  }
}
