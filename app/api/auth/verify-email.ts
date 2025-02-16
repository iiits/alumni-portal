import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Call the backend API directly using axios
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyemail`, { token });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Error verifying email:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Internal Server Error",
    });
  }
}

