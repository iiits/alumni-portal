"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid verification token.");
        return;
      }

      try {
        const response = await axios.post("/api/auth/verify-email", { token });

        if (response.status === 200) {
          setStatus("success");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setErrorMessage(response.data?.message || "Verification failed.");
        }
      } catch (error: any) {
        console.error("Verification failed:", error);
        setStatus("error");
        setErrorMessage(error.response?.data?.message || "Something went wrong.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        {status === "loading"
          ? "Verifying your email..."
          : status === "success"
          ? "Email verified successfully!"
          : "Verification failed"}
      </h2>

      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {status === "loading"
          ? "Please wait while we verify your email."
          : status === "success"
          ? "You will be redirected shortly."
          : errorMessage}
      </p>
    </div>
  );
}
