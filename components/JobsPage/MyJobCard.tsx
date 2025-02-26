import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
          <h3 className="text-xl font-semibold">
            {job.jobName} ({job.role})
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <div className="flex max-sm:flex-col gap-2">
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

      <p className="text-sm text-gray-700 mt-2">{job.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{job.type}</Badge>
        <Badge variant="secondary">{job.workType}</Badge>
        {job.stipend && <Badge variant="outline">{job.stipend}</Badge>}
      </div>

      <div className="mt-4 space-y-2">
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
      </div>
    </div>
  );
}
