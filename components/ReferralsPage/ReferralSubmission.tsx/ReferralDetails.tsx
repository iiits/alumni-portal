"use client";

import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/lib/api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import NoData from "../../Commons/NoData";
import Searching from "../../Commons/Searching";
import { Submission } from "../types";
import SubmissionCard from "./SubmissionCard";

export default function ReferralPage({ params }: { params: { id: string } }) {
  const {
    data: submissions,
    isLoading,
    error,
    refetch,
  } = useQuery<Submission[]>({
    queryKey: ["submissions", params.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/referralsubmissions/${params.id}`,
      );
      return response.data?.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      submissionId,
      status,
    }: {
      submissionId: string;
      status: "accepted" | "rejected";
    }) => {
      await axiosInstance.put(`/referralsubmissions/${submissionId}`, {
        status,
      });
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  if (isLoading) {
    return (
      <Searching
        message="Loading Submissions..."
        description="Fetching referral submissions."
      />
    );
  }

  if (error) {
    return (
      <NoData
        message="Failed to load submissions"
        description="An error occurred while fetching the submissions."
        url="/"
      />
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <NoData
        message="No Submissions Found"
        description="No submissions have been made for this referral yet."
        url="/"
      />
    );
  }

  const referral = submissions[0].referralId;

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {referral.jobDetails.title} ({referral.jobDetails.role})
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {referral.jobDetails.company}
        </p>
        <p className="mb-4">{referral.jobDetails.description}</p>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">
        Submissions ({submissions.length})
      </h2>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onUpdateStatus={(status) =>
              updateStatusMutation.mutate({
                submissionId: submission.id,
                status,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
