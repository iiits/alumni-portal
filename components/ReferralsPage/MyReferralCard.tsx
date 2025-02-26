import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Referral } from "./types";

interface MyReferralCardProps {
  referral: Referral;
  onEdit: (referral: Referral) => void;
  onDelete: (referral: Referral) => void;
}

export default function MyReferralCard({
  referral,
  onEdit,
  onDelete,
}: MyReferralCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-semibold">
            {referral.jobDetails.title} ({referral.jobDetails.role})
          </h3>
          <p className="text-gray-600 text-lg">{referral.jobDetails.company}</p>
        </div>
        <Badge variant="secondary" className="text-base">
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

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(referral)}
            className="flex items-center gap-1"
          >
            <Pencil size={16} /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(referral)}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
