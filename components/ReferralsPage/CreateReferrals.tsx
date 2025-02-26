"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface JobDetails {
  title: string;
  description: string;
  company: string;
  role: string;
  link: string;
}

interface ReferralFormData {
  jobDetails: JobDetails;
  lastApplyDate: string;
  numberOfReferrals: number;
}

interface CreateReferralDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export default function CreateReferralDialog({
  isOpen,
  setIsOpen,
  onSuccess,
}: CreateReferralDialogProps) {
  const [formData, setFormData] = useState<ReferralFormData>({
    jobDetails: {
      title: "",
      description: "",
      company: "",
      role: "",
      link: "",
    },
    lastApplyDate: "",
    numberOfReferrals: 0,
  });

  const createReferralMutation = useMutation({
    mutationFn: async (data: ReferralFormData) => {
      const response = await axiosInstance.post("/referrals", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Referral created successfully!");
      setIsOpen(false);
      resetForm();
      onSuccess();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create referral";
      toast.error(errorMessage);
      console.error("Error creating referral:", error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes("jobDetails.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        jobDetails: {
          ...formData.jobDetails,
          [field]: value,
        },
      });
    } else if (name === "numberOfReferrals") {
      // Handle number input
      const numValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : Math.max(0, numValue), // Ensure non-negative
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const { jobDetails, lastApplyDate } = formData;
    if (
      !jobDetails.title ||
      !jobDetails.description ||
      !jobDetails.company ||
      !jobDetails.role ||
      !jobDetails.link ||
      !lastApplyDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // URL validation
    const urlPattern = /^https?:\/\/\S+$/;
    if (!urlPattern.test(jobDetails.link)) {
      toast.error("Please provide a valid URL for the job link");
      return;
    }

    // Date validation
    const applyDate = new Date(lastApplyDate);
    const currentDate = new Date();
    if (applyDate <= currentDate) {
      toast.error("Last apply date must be in the future");
      return;
    }

    createReferralMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      jobDetails: {
        title: "",
        description: "",
        company: "",
        role: "",
        link: "",
      },
      lastApplyDate: "",
      numberOfReferrals: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <span className="text-lg">+</span> Create Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg mx-auto p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Create a New Referral
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <LabelInputContainer>
            <Label htmlFor="jobDetails.title">Job Title*</Label>
            <Input
              id="jobDetails.title"
              name="jobDetails.title"
              value={formData.jobDetails.title}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="jobDetails.company">Company*</Label>
            <Input
              id="jobDetails.company"
              name="jobDetails.company"
              value={formData.jobDetails.company}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="jobDetails.role">Role*</Label>
            <Input
              id="jobDetails.role"
              name="jobDetails.role"
              value={formData.jobDetails.role}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="jobDetails.link">Job Link*</Label>
            <Input
              id="jobDetails.link"
              name="jobDetails.link"
              value={formData.jobDetails.link}
              onChange={handleInputChange}
              placeholder="https://..."
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastApplyDate">Last Apply Date*</Label>
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
          <LabelInputContainer>
            <Label htmlFor="numberOfReferrals">Number of Referrals*</Label>
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
            <Label htmlFor="jobDetails.description">Description*</Label>
            <Textarea
              id="jobDetails.description"
              name="jobDetails.description"
              value={formData.jobDetails.description}
              onChange={handleInputChange}
              rows={4}
              maxLength={2000}
              required
            />
          </LabelInputContainer>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createReferralMutation.isPending}>
              {createReferralMutation.isPending
                ? "Creating..."
                : "Create Referral"}
            </Button>
          </DialogFooter>
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
