import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Job } from "./types";

export default function JobsCard({ job }: { job: Job }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-semibold">
            {job.jobName} ({job.role})
          </h3>
          <p className="text-gray-600 text-lg">{job.company}</p>
        </div>
        <div className="flex max-sm:flex-col gap-2">
          <Badge variant="secondary" className="text-base">
            {job.type}
          </Badge>
          <Badge variant="secondary" className="text-base">
            {job.workType}
          </Badge>
        </div>
      </div>

      <p className="text-gray-700 mt-2">{job.description}</p>

      <div className="mt-2">
        {job.links && job.links.length > 0 && (
          <div className="space-y-1 text-lg text-blue-500">
            {job.links.map((link, index) => (
              <Link
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink size={20} className="inline-block mr-2" />
                {link.replace(/^https?:\/\//, "")}
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="mt-2 text-red-500">
        <strong>Last Date to Apply:</strong>{" "}
        {new Date(job.lastApplyDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>

      <div className="mt-2 space-y-2">
        {job.eligibility.requirements && (
          <div>
            <strong>Requirements:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {job.eligibility.requirements.map((req) => (
                <Badge key={req} variant="secondary" className="text-base">
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
              <Badge key={batch} variant="secondary" className="text-base">
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

        <div className="flex items-center">
          <strong>Posted By:</strong>{" "}
          <Link
            href={`/profile/${job.postedBy.id}`}
            className="flex items-center ml-2 text-blue-500 hover:text-blue-600"
          >
            <span>
              {job.postedBy.name} ({job.postedBy.collegeEmail})
            </span>
            <ExternalLink size={20} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
