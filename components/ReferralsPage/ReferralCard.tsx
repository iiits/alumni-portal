import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateSubmission from "./ReferralSubmission.tsx/CreateSubmission";
import { Referral } from "./types";

export default function ReferralCard({ referral }: { referral: Referral }) {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-semibold">
            {referral.jobDetails.title} ({referral.jobDetails.role})
          </h3>
          <p className="text-gray-600 text-lg">{referral.jobDetails.company}</p>
        </div>
        <Badge
          variant="secondary"
          className={cn("text-base", {
            "bg-green-100 text-green-800": referral.isActive,
            "bg-red-100 text-red-800": !referral.isActive,
          })}
        >
          {referral.isActive ? "Active" : "Closed"}
        </Badge>
      </div>

      <p className="text-gray-700 mt-2">{referral.jobDetails.description}</p>

      <div className="mt-2">
        <Link
          href={referral.jobDetails.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ExternalLink size={20} className="inline-block mr-2" />
          {referral.jobDetails.link.replace(/^https?:\/\//, "")}
        </Link>
      </div>

      <div className="mt-4 space-y-2">
        <p>
          <strong>Number of Referrals Available:</strong>{" "}
          {referral.numberOfReferrals}
        </p>

        <p className="text-red-500">
          <strong>Last Date to Apply:</strong>{" "}
          {new Date(referral.lastApplyDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

        <div className="flex items-center">
          <strong>Posted By:</strong>{" "}
          <Link
            href={`/profile/${referral.postedBy.id}`}
            className="flex items-center ml-2 text-blue-500 hover:text-blue-600"
          >
            <span>
              {referral.postedBy.name} ({referral.postedBy.collegeEmail})
            </span>
            <ExternalLink size={20} className="ml-1" />
          </Link>
        </div>

        <div className="flex gap-2 mt-4">
          {referral.isActive && (
            <Button
              onClick={() => setIsSubmitDialogOpen(true)}
              variant="secondary"
              className="w-full"
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>

      <CreateSubmission
        referralId={referral.id}
        isOpen={isSubmitDialogOpen}
        setIsOpen={setIsSubmitDialogOpen}
      />
    </div>
  );
}
