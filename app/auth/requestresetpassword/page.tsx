"use client";

import React from "react";
import RequestResetPassword from "@/components/ResetPassword/RequestResetPassword";
import { Suspense } from "react";
import FallbackLoader from "@/components/FallBackLoader";

export default function RequestResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<FallbackLoader />}>
        <RequestResetPassword />
      </Suspense>
    </div>
  );
}