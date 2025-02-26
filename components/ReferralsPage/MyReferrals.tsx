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
import MyReferralCard from "./MyReferralCard";
import { Referral } from "./types";
import UpdateReferral from "./UpdateReferral";

export default function MyReferrals() {
  const { user } = useUserStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null,
  );

  const {
    data: referrals,
    isLoading,
    error,
    refetch,
  } = useQuery<Referral[]>({
    queryKey: ["userReferrals", user?.id],
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
      await axiosInstance.delete(`/referrals/${selectedReferral.id}`);
    },
    onSuccess: () => {
      toast.success("Referral deleted successfully!");
      setDeleteDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete referral");
    },
  });

  const handleEditClick = (referral: Referral) => {
    setSelectedReferral(referral);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (referral: Referral) => {
    setSelectedReferral(referral);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!editDialogOpen) {
      setSelectedReferral(null);
    }
  }, [editDialogOpen]);

  if (isLoading)
    return (
      <Searching
        message="Loading Your Referrals..."
        description="Fetching your referrals."
      />
    );

  if (error)
    return (
      <NoData
        message="Failed to load your referrals."
        description="An error occurred while fetching your data."
        url="/"
      />
    );

  if (!referrals || referrals.length === 0)
    return (
      <NoData
        message="No Referrals Posted"
        description="You haven't posted any referrals yet."
        url="/"
      />
    );

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <MyReferralCard
          key={referral.id}
          referral={referral}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      ))}

      {selectedReferral && editDialogOpen && (
        <UpdateReferral
          referral={selectedReferral}
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
              This action cannot be undone. This will permanently delete the
              referral for{" "}
              <strong>
                {selectedReferral?.jobDetails.title} (
                {selectedReferral?.jobDetails.role})
              </strong>
              .
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
    </div>
  );
}
