"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Referral, ReferralFormData } from "./types";

interface EditReferralProps {
  referral: Referral;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function UpdateReferral({
  referral,
  isOpen,
  setIsOpen,
  refetch,
}: EditReferralProps) {
  const [formData, setFormData] = useState<ReferralFormData>({
    jobDetails: {
      title: referral.jobDetails.title,
      description: referral.jobDetails.description,
      company: referral.jobDetails.company,
      role: referral.jobDetails.role,
      link: referral.jobDetails.link,
    },
    lastApplyDate: referral.lastApplyDate.split("T")[0],
    numberOfReferrals: referral.numberOfReferrals,
  });

  const updateReferralMutation = useMutation({
    mutationFn: async (data: ReferralFormData) => {
      const response = await axiosInstance.put(
        `/referrals/${referral.id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Referral updated successfully!");
      setIsOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update referral");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes("jobDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        jobDetails: {
          ...prev.jobDetails,
          [field]: value,
        },
      }));
    } else if (name === "numberOfReferrals") {
      const numValue = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : Math.max(0, numValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlPattern = /^https?:\/\/\S+$/;
    if (!urlPattern.test(formData.jobDetails.link)) {
      toast.error("Please provide a valid URL for the job link");
      return;
    }

    const applyDate = new Date(formData.lastApplyDate);
    const currentDate = new Date();
    if (applyDate <= currentDate) {
      toast.error("Last apply date must be in the future");
      return;
    }

    updateReferralMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg lg:max-w-2xl max-h-[80vh] mx-auto p-6 rounded-lg shadow-lg overflow-y-scroll">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit Referral
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <LabelInputContainer>
            <label htmlFor="jobDetails.title">Job Title</label>
            <Input
              id="jobDetails.title"
              name="jobDetails.title"
              value={formData.jobDetails.title}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="jobDetails.company">Company</label>
            <Input
              id="jobDetails.company"
              name="jobDetails.company"
              value={formData.jobDetails.company}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="jobDetails.role">Role</label>
            <Input
              id="jobDetails.role"
              name="jobDetails.role"
              value={formData.jobDetails.role}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="jobDetails.description">Description</label>
            <Textarea
              id="jobDetails.description"
              name="jobDetails.description"
              value={formData.jobDetails.description}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="jobDetails.link">Job Link</label>
            <Input
              id="jobDetails.link"
              name="jobDetails.link"
              value={formData.jobDetails.link}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="numberOfReferrals">Number of Referrals</label>
            <Input
              id="numberOfReferrals"
              name="numberOfReferrals"
              type="number"
              min="0"
              value={formData.numberOfReferrals}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label htmlFor="lastApplyDate">Last Apply Date</label>
            <Input
              id="lastApplyDate"
              name="lastApplyDate"
              type="date"
              value={formData.lastApplyDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </LabelInputContainer>

          <Button
            type="submit"
            className="w-full"
            disabled={updateReferralMutation.isPending}
          >
            {updateReferralMutation.isPending
              ? "Updating..."
              : "Update Referral"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
