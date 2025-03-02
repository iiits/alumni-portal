"use client";
import ReferralPage from "@/components/ReferralsPage/ReferralSubmission.tsx/ReferralDetails";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Profile() {
  const { id } = useParams() as { id: string };

  if (!id) {
    toast.warning("Referral ID not found.");
    return <p className="text-center">Referral ID not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center m-3">
      <ReferralPage params={{ id }} />
    </div>
  );
}
