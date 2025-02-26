"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Job, JobFormData } from "./types";

interface EditJobProps {
  job: Job;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function EditJob({
  job,
  isOpen,
  setIsOpen,
  refetch,
}: EditJobProps) {
  const [formData, setFormData] = useState<JobFormData>({
    jobName: job.jobName,
    company: job.company,
    role: job.role,
    eligibility: job.eligibility,
    description: job.description,
    type: job.type,
    stipend: job.stipend || "",
    duration: job.duration || "",
    workType: job.workType,
    links: job.links,
    lastApplyDate: job.lastApplyDate.split("T")[0],
  });

  const editJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      data.links = data.links.filter((l) => l.trim() !== "");
      data.eligibility.requirements = data.eligibility.requirements.filter(
        (r) => r.trim() !== "",
      );
      data.eligibility.batch = data.eligibility.batch.filter(
        (b) => b.trim() !== "",
      );

      const response = await axiosInstance.put(`/jobs/${job.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Job posting updated successfully!");
      setIsOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update job posting",
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const batches = e.target.value.split(",").map((b) => b.trim());
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        batch: batches,
      },
    }));
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const requirements = e.target.value.split(",").map((r) => r.trim());
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        requirements,
      },
    }));
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const links = e.target.value.split(",").map((l) => l.trim());
    setFormData((prev) => ({
      ...prev,
      links,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editJobMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg lg:max-w-2xl max-h-[80vh] mx-auto p-6 rounded-lg shadow-lg overflow-y-scroll">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit Job Posting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <LabelInputContainer>
            <Label htmlFor="jobName">Job Title</Label>
            <Input
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="workType">Work Type</Label>
            <Select
              value={formData.workType}
              onValueChange={(value) => handleSelectChange("workType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="stipend">Stipend/Salary</Label>
            <Input
              id="stipend"
              name="stipend"
              value={formData.stipend}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="batch">Eligible Batches (comma-separated)</Label>
            <Input
              id="batch"
              name="batch"
              value={formData.eligibility.batch.join(", ")}
              onChange={handleBatchChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
            <Input
              id="requirements"
              name="requirements"
              value={formData.eligibility.requirements.join(", ")}
              onChange={handleRequirementsChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="links">Links (comma-separated)</Label>
            <Input
              id="links"
              name="links"
              value={formData.links.join(", ")}
              onChange={handleLinksChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastApplyDate">Last Apply Date</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
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
            <Button type="submit" disabled={editJobMutation.isPending}>
              {editJobMutation.isPending ? "Updating..." : "Update Job"}
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
