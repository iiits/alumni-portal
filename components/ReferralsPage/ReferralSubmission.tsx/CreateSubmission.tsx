"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface CreateSubmissionProps {
  referralId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateSubmission({
  referralId,
  isOpen,
  setIsOpen,
  onSuccess,
}: CreateSubmissionProps) {
  const [formData, setFormData] = useState({
    resumeLink: "",
    coverLetter: "",
    whyReferMe: "",
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await axiosInstance.post("/referralsubmissions", {
        referralId,
        ...data,
      });
    },
    onSuccess: () => {
      toast.success("Referral application created successfully!");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create submission",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubmissionMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg lg:max-w-2xl max-h-[80vh] mx-auto p-6 rounded-lg shadow-lg overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create Submission</DialogTitle>
          <DialogDescription>
            Submit your application for this referral opportunity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resumeLink">Resume Link</Label>
            <Input
              id="resumeLink"
              value={formData.resumeLink}
              onChange={(e) =>
                setFormData({ ...formData, resumeLink: e.target.value })
              }
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              placeholder="Your cover letter here..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyReferMe">Why Should You Be Referred?</Label>
            <Textarea
              id="whyReferMe"
              value={formData.whyReferMe}
              onChange={(e) =>
                setFormData({ ...formData, whyReferMe: e.target.value })
              }
              placeholder="Why should you be referred for this position?"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createSubmissionMutation.isPending}
          >
            {createSubmissionMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
