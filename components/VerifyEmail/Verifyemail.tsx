"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await axiosInstance.post("/auth/verifyemail", { token });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    },
    onError: () => {
      toast.error("Error verifying email. Please try again later.");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        "/api/auth/resend-verification",
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification email resent! Check your inbox.");
    },
    onError: () => {
      toast.error(
        "Error resending verification email. Please try again later.",
      );
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    } else {
      toast.warning("No token found. Redirecting to login...");
      router.push("/login");
    }
  }, [token]);

  const handleResend = () => {
    resendMutation.mutate();
  };

  const status = verifyMutation.isPending
    ? "loading"
    : verifyMutation.isSuccess
      ? "success"
      : "error";

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Email Verification Image */}
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={
              status === "loading" ? "/email-loading.svg" : "/verify-email.svg"
            }
            alt="Email Verification"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            {status === "loading"
              ? "Verifying your email..."
              : status === "success"
                ? "Email verified successfully!"
                : "Verification failed"}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center">
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait while we verify your email
              </span>
            ) : status === "success" ? (
              "You will be redirected to login shortly"
            ) : (
              verifyMutation.error?.message || "Something went wrong"
            )}
          </p>

          {/* Action Button */}
          {status === "error" && (
            <button
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg
                            transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
            >
              {resendMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Need help?{" "}
          <button
            onClick={() => router.push("/contactus")}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Contact Support
          </button>
        </p>
      </div>
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
