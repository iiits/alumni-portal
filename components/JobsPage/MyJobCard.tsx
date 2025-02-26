import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Job } from "./types";

interface MyJobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export default function MyJobCard({ job, onEdit, onDelete }: MyJobCardProps) {
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

      {/* Add links section */}
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(job)}
            className="flex items-center gap-1"
          >
            <Pencil size={16} /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(job)}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
