import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Job } from "./types";

export default function JobsCard({ job }: { job: Job }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-semibold">
            {job.jobName} ({job.role})
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{job.type}</Badge>
          <Badge variant="outline">{job.workType}</Badge>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-2">{job.description}</p>

      <div className="mt-2">
        {job.links && job.links.length > 0 && (
          <div className="space-y-1">
            {job.links.map((link, index) => (
              <Link
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink
                  size={16}
                  className="inline-block mr-2 text-blue-500"
                />
                {link.replace(/^https?:\/\//, "")}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {job.eligibility.requirements && (
          <div>
            <strong>Requirements:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {job.eligibility.requirements.map((req) => (
                <Badge key={req} variant="secondary">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <strong>Eligible Batches:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {job.eligibility.batch.map((batch) => (
              <Badge key={batch} variant="secondary">
                {batch}
              </Badge>
            ))}
          </div>
        </div>

        {job.stipend && (
          <p>
            <strong>Stipend:</strong> {job.stipend}
          </p>
        )}

        {job.duration && (
          <p>
            <strong>Duration:</strong> {job.duration}
          </p>
        )}

        <p>
          <strong>Last Date to Apply:</strong>{" "}
          {new Date(job.lastApplyDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

        <div>
          <strong>Posted By:</strong>{" "}
          <Link
            href={`/profile/${job.postedBy.id}`}
            className="hover:underline"
          >
            <span>
              {job.postedBy.name} ({job.postedBy.collegeEmail})
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
