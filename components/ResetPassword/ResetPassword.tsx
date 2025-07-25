"use client";

import React, { useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset password link");
      router.push("/auth/login");
    }
  }, [token, router]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      const response = await axiosInstance.post("/auth/resetPassword", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful! Please login with your new password.");
      formRef.current?.reset();
      setTimeout(() => router.push("/auth/login"), 2000);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reset password.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    resetPasswordMutation.mutate({ newPassword, token: token || "" });
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/reset-password.svg"
            alt="Reset Password"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Set New Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Enter your new password"
              />
            </div>

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {resetPasswordMutation.isPending
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}