"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";
import NoData from "../../Commons/NoData";
import Searching from "../../Commons/Searching";
import MySubmissionCard from "./MySubmissionCard";

export default function MySubmissions() {
  const {
    data: submissions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: async () => {
      const response = await axiosInstance.get("/referralsubmissions/user");
      return response.data?.data;
    },
  });

  if (isLoading) {
    return (
      <Searching
        message="Loading Your Submissions..."
        description="Fetching your referral submissions."
      />
    );
  }

  if (error) {
    return (
      <NoData
        message="Failed to load submissions."
        description="An error occurred while fetching your submissions."
        url="/"
      />
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <NoData
        message="No Submissions Found"
        description="You haven't submitted any referral requests yet."
        url="/"
      />
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission: any) => (
        <MySubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}
