"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface JobDetails {
  title: string;
  description: string;
  company: string;
  role: string;
  link: string;
}

interface Referral {
  id: string;
  isActive: boolean;
  numberOfReferrals: number;
  jobDetails: JobDetails;
  postedBy: {
    id: string;
    name: string;
    collegeEmail: string;
    personalEmail: string;
  };
  postedOn: string;
  lastApplyDate: string;
}

export default function MyReferrals() {
  const { user } = useUserStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null,
  );

  const { data, error, isLoading, refetch } = useQuery<Referral[]>({
    queryKey: ["myReferrals", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const response = await axiosInstance.get(`/referrals/user/${user.id}`);
      return response.data?.data;
    },
    enabled: !!user?.id,
  });
  const deleteReferralMutation = useMutation({
    mutationFn: async () => {
      if (!selectedReferral) throw new Error("No referral selected");

      const response = await axiosInstance.delete(
        `/referrals/${selectedReferral.id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Referral deleted successfully!");
      setDeleteDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete referral";
      toast.error(errorMessage);
    },
  });
  const handleDeleteClick = (referral: Referral) => {
    setSelectedReferral(referral);
    setDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Referrals</CardTitle>
        <CardDescription>Referrals you have posted for others</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <Searching
            message="Loading Your Referrals..."
            description="Fetching your posted job referrals."
          />
        )}

        {/* Error State */}
        {error && (
          <NoData
            message="Failed to load your referrals."
            description="An error occurred while fetching your data."
            url="/"
          />
        )}

        {/* No Data State */}
        {!isLoading && !error && (!data || data.length === 0) && (
          <NoData
            message="No Referrals Posted"
            description="You haven't posted any job referrals yet."
            url="/"
          />
        )}

        {/* Referrals List */}
        <ul className="space-y-4">
          {data?.map((referral) => (
            <li key={referral.id} className="p-4 border rounded-lg shadow">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">
                  {referral.jobDetails.title}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(referral)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">{referral.jobDetails.company}</p>
              <p className="text-gray-800 mt-2">
                {referral.jobDetails.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <p>
                  <strong>Last Apply Date:</strong>{" "}
                  {new Date(referral.lastApplyDate).toDateString()}
                </p>
                <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {referral.numberOfReferrals} referrals
                </p>
              </div>
              <div className="mt-2 flex justify-between">
                <span
                  className={`px-2 py-1 rounded text-sm ${referral.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {referral.isActive ? "Active" : "Closed"}
                </span>
                <a
                  href={referral.jobDetails.link}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View Job Posting
                </a>
              </div>
            </li>
          ))}
        </ul>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                referral and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteReferralMutation.mutate()}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteReferralMutation.isPending}
              >
                {deleteReferralMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
