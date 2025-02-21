"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useMutation } from "@tanstack/react-query";
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
      alert("No token found.");
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
            : verifyMutation.error?.message || "Something went wrong"}
      </p>

      {status === "error" && (
        <button
          className="mt-6 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          onClick={handleResend}
          disabled={resendMutation.isPending}
        >
          {resendMutation.isPending
            ? "Resending..."
            : "Resend Verification Email"}{" "}
          &rarr;
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
