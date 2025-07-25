"use client";

import React from "react";
import ResetPassword from "@/components/ResetPassword/ResetPassword";
import { Suspense } from "react";
import FallbackLoader from "@/components/FallBackLoader";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<FallbackLoader />}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}