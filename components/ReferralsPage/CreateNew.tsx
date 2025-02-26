"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ReferralFormData } from "./types";

interface CreateReferralProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function CreateNew({
  isOpen,
  setIsOpen,
  refetch,
}: CreateReferralProps) {
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
      const response = await axiosInstance.post("/referrals", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Referral created successfully!");
      setIsOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create referral");
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

    createReferralMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <span className="text-lg">+</span> Create Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-lg lg:max-w-2xl max-h-[80vh] mx-auto p-6 rounded-lg shadow-lg overflow-y-scroll">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Create a New Referral
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
              placeholder="e.g. Software Development Engineer"
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
              placeholder="e.g. Google, Inc."
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
              placeholder="e.g. SDE II"
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
              placeholder="Job description and requirements..."
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
              placeholder="https://example.com/job"
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
            disabled={createReferralMutation.isPending}
          >
            {createReferralMutation.isPending
              ? "Creating..."
              : "Create Referral"}
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
