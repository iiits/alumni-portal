"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

function EmailVerificationAlert() {
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

  const handleResend = () => {
    resendMutation.mutate();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-lg w-full mx-auto text-center space-y-6">
        {/* Image */}
        <div className="relative w-full h-64 md:h-80">
          <Image
            src="/verify-email.svg"
            alt="Email Verification"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Please Verify Your Email
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            We have sent a verification link to your college email address.
            Please check your inbox and click the link to complete your
            registration.
          </p>

          {/* Additional Information */}
          <div className="mt-8 space-y-4 text-sm text-gray-500">
            <p>
              Didn&apos;t receive the email?{" "}
              <button
                onClick={handleResend}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Resend verification email
              </button>
            </p>
            <p>
              Please also check your spam folder if you don&apos;t see the email
              in your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationAlert;
