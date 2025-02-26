"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import { Job } from "./types";
import EditJob from "./UpdateJob";

export default function MyJobs() {
  const { user } = useUserStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = useQuery<Job[]>({
    queryKey: ["userJobs", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const response = await axiosInstance.get(`/jobs/user/${user.id}`);
      return response.data?.data;
    },
    enabled: !!user?.id,
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await axiosInstance.delete(`/jobs/${jobId}`);
    },
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      setDeleteDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete job");
    },
  });

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  if (isLoading)
    return (
      <Searching
        message="Loading Your Jobs..."
        description="Fetching your job postings."
      />
    );

  if (error)
    return (
      <NoData
        message="Failed to load your jobs."
        description="An error occurred while fetching your data."
        url="/"
      />
    );

  if (!jobs || jobs.length === 0)
    return (
      <NoData
        message="No Jobs Posted"
        description="You haven't posted any jobs yet."
        url="/"
      />
    );

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="p-4 border rounded-lg shadow">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">
              {job.jobName} ({job.role})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(job)}
                className="flex items-center gap-1"
              >
                <Pencil size={16} /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(job)}
                className="flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>

          <p className="text-gray-600">{job.company}</p>
          <p className="text-gray-800 mt-2">{job.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{job.type}</Badge>
            <Badge variant="secondary">{job.workType}</Badge>
            {job.stipend && <Badge variant="outline">{job.stipend}</Badge>}
          </div>

          <div className="mt-3">
            <p>
              <strong>Requirements:</strong>{" "}
              {job.eligibility.requirements.join(", ")}
            </p>
            <p>
              <strong>Eligible Batches:</strong>{" "}
              {job.eligibility.batch.join(", ")}
            </p>
            <p>
              <strong>Last Apply Date:</strong>{" "}
              {new Date(job.lastApplyDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {selectedJob && (
        <EditJob
          job={selectedJob}
          isOpen={editDialogOpen}
          setIsOpen={setEditDialogOpen}
          refetch={refetch}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedJob && deleteJobMutation.mutate(selectedJob.id)
              }
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
