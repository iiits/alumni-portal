"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axios";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid verification token.");
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/verifyemail", {
          token,
        });

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
        setErrorMessage(
          error.response?.data?.message || "Something went wrong.",
        );
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await axiosInstance.post(
        "/api/auth/resend-verification",
      );
      if (response.status === 200) {
        alert("Verification email resent! Check your inbox.");
      } else {
        alert("Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Resend failed:", error);
      alert("Error resending verification email.");
    } finally {
      setResending(false);
    }
  };

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

      {status === "error" && (
        <button
          className="mt-6 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend Verification Email"} &rarr;
          <BottomGradient />
        </button>
      )}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
