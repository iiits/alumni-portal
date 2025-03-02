import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

interface SubmissionCardProps {
  submission: {
    id: string;
    userId: {
      name: string;
      collegeEmail: string;
      personalEmail: string;
    };
    resumeLink: string;
    coverLetter: string;
    whyReferMe: string;
    status: string;
    submittedAt: string;
  };
  onUpdateStatus: (status: "accepted" | "rejected") => void;
}

export default function SubmissionCard({
  submission,
  onUpdateStatus,
}: SubmissionCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{submission.userId.name}</h3>
          <p className="text-gray-600">{submission.userId.collegeEmail}</p>
          <p className="text-gray-600">{submission.userId.personalEmail}</p>
        </div>
        <Badge
          className={cn("capitalize", {
            "bg-green-100 text-green-800": submission.status === "accepted",
            "bg-red-100 text-red-800": submission.status === "rejected",
            "bg-gray-100 text-gray-800": submission.status === "pending",
          })}
        >
          {submission.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Resume</h4>
          <Link
            href={submission.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={16} className="mr-2" />
            View Resume
          </Link>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Cover Letter</h4>
          <p className="text-gray-700">{submission.coverLetter}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Why Refer Me</h4>
          <p className="text-gray-700">{submission.whyReferMe}</p>
        </div>

        {submission.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              className="bg-green-400 hover:bg-green-500"
              onClick={() => onUpdateStatus("accepted")}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              onClick={() => onUpdateStatus("rejected")}
            >
              Reject
            </Button>
          </div>
        )}
        {submission.status === "accepted" && (
          <Button
            variant="destructive"
            onClick={() => onUpdateStatus("rejected")}
          >
            Reject Instead
          </Button>
        )}
        {submission.status === "rejected" && (
          <Button
            variant="secondary"
            className="bg-green-400 hover:bg-green-500"
            onClick={() => onUpdateStatus("accepted")}
          >
            Accept Instead
          </Button>
        )}
      </div>
    </Card>
  );
}
