"use client";
import React from "react";
import {useState} from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { toast } from "sonner";
import Image from "next/image";

export default function RequestResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);

  const requestResetMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post("/auth/requestResetPassword", {
        email: email
      });
      return response.data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Password reset link sent successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset password link.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    requestResetMutation.mutate(email);
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/request-reset-password.svg"
            alt="Reset Password"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Check Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Note: The link will expire in 15 minutes for security reasons.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your college email address below to receive a password reset link.
                </p>
              </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                College Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@iiits.in"
                required
                pattern=".*@iiits\.in$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={requestResetMutation.isPending}
              className="w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {requestResetMutation.isPending
                ? "Sending Link..."
                : "Send Reset Link"}
            </button>
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}