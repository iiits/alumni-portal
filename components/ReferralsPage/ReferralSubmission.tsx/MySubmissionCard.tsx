import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface MySubmissionCardProps {
  submission: {
    id: string;
    status: string;
    submittedAt: string;
    resumeLink: string;
    coverLetter: string;
    whyReferMe: string;
    referralId: {
      jobDetails: {
        title: string;
        company: string;
        role: string;
        link: string;
        description: string;
      };
      isActive: boolean;
      lastApplyDate: string;
    };
  };
}

export default function MySubmissionCard({
  submission,
}: MySubmissionCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-semibold">
            {submission.referralId.jobDetails.title} (
            {submission.referralId.jobDetails.role})
          </h3>
          <p className="text-gray-600 text-lg">
            {submission.referralId.jobDetails.company}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn("text-base", {
            "bg-green-100 text-green-800": submission.status === "accepted",
            "bg-red-100 text-red-800": submission.status === "rejected",
            "bg-yellow-100 text-yellow-800": submission.status === "pending",
          })}
        >
          {submission.status.charAt(0).toUpperCase() +
            submission.status.slice(1)}
        </Badge>
      </div>

      <p className="text-gray-700 mt-2">
        {submission.referralId.jobDetails.description}
      </p>

      <div className="flex mt-2 space-x-4">
        <Link
          href={submission.referralId.jobDetails.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ExternalLink size={20} className="inline-block mr-2" />
          Job Link
        </Link>

        <Link
          href={submission.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ExternalLink size={20} className="inline-block mr-2" />
          Resume
        </Link>
      </div>

      <div className="mt-4">
        <p className="text-gray-600">
          <strong>Submitted on:</strong>{" "}
          {new Date(submission.submittedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="mt-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-refer">
            <AccordionTrigger>Why Refer Me</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              {submission.whyReferMe || "No reason provided"}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cover-letter">
            <AccordionTrigger>Cover Letter</AccordionTrigger>
            <AccordionContent className="text-gray-700 whitespace-pre-wrap">
              {submission.coverLetter || "No cover letter provided"}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
