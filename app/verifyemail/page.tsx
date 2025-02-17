import FallbackLoader from "@/components/FallBackLoader";
import VerifyEmail from "@/components/VerifyEmail/Verifyemail";
import { Suspense } from "react";

export default function verifyEmail() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<FallbackLoader />}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
