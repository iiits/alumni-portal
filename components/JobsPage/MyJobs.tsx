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
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import MyJobCard from "./MyJobCard";
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

  useEffect(() => {
    if (!editDialogOpen) {
      setSelectedJob(null);
    }
  }, [editDialogOpen]);

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
        <MyJobCard
          key={job.id}
          job={job}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      ))}

      {selectedJob && editDialogOpen && (
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
              posting for{" "}
              <strong>
                {selectedJob?.jobName} ({selectedJob?.role})
              </strong>
              .
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
