"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import { cn } from "@/lib/utils";

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

interface ReferralFormData {
  jobDetails: JobDetails;
  lastApplyDate: string;
}

export default function ReferralsTabs() {
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ReferralFormData>({
    jobDetails: {
      title: "",
      description: "",
      company: "",
      role: "",
      link: "",
    },
    lastApplyDate: "",
  });

  const { data, error, isLoading, refetch } = useQuery<Referral[]>({
    queryKey: ["referrals", month, year],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (month) params.month = String(month);
      if (year) params.year = String(year);

      const response = await axiosInstance.get("/referrals/filter", { params });
      return response.data?.data;
    },
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
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || "Failed to create referral";
      toast.error(errorMessage);
      console.error("Error creating referral:", error);
    },
  });

  const handleFilterChange = () => {
    refetch();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!jobDetails.title || !jobDetails.description || !jobDetails.company || 
        !jobDetails.role || !jobDetails.link || !lastApplyDate) {
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
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-10">
        <h2 className="text-lg font-semibold">Job Referrals</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <span className="text-lg">+</span> Create Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg mx-auto p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Create a New Referral</DialogTitle>
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
            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createReferralMutation.isPending}>
              {createReferralMutation.isPending ? "Creating..." : "Create Referral"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

      </div>

      <Tabs defaultValue="all" className="w-[600px] mx-auto pb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Referrals</TabsTrigger>
          <TabsTrigger value="mine">My Referrals</TabsTrigger>
        </TabsList>

        {/* All Referrals */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Referrals</CardTitle>
              <CardDescription>
                Browse and filter job referrals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-4 flex gap-4">
                <select
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value ? Number(e.target.value) : "")
                  }
                  className="border p-2 rounded"
                >
                  <option value="">All Months</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value ? Number(e.target.value) : "")
                  }
                  className="border p-2 rounded"
                >
                  <option value="">All Years</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>

                <Button onClick={handleFilterChange}>Apply Filters</Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <Searching
                  message="Loading Referrals..."
                  description="Fetching job referrals for you."
                />
              )}

              {/* Error State */}
              {error && (
                <NoData
                  message="Failed to load referrals."
                  description="An error occurred while fetching data."
                  url="/"
                />
              )}

              {/* No Data State */}
              {!isLoading && !error && (!data || data.length === 0) && (
                <NoData
                  message="No Referrals Available"
                  description="No job referrals match your criteria."
                  url="/"
                />
              )}

              {/* Referrals List */}
              <ul className="space-y-4">
                {data?.map((referral) => (
                  <li
                    key={referral.id}
                    className="p-4 border rounded-lg shadow"
                  >
                    <h2 className="text-xl font-semibold">
                      {referral.jobDetails.title}
                    </h2>
                    <p className="text-gray-600">
                      {referral.jobDetails.company}
                    </p>
                    <p className="text-gray-800">
                      {referral.jobDetails.description}
                    </p>
                    <p>
                      <strong>Posted By:</strong> {referral.postedBy.name} (
                      {referral.postedBy.collegeEmail})
                    </p>
                    <p>
                      <strong>Last Apply Date:</strong>{" "}
                      {new Date(referral.lastApplyDate).toDateString()}
                    </p>
                    <a
                      href={referral.jobDetails.link}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Apply Now
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Referrals (Empty for Now) */}
        <TabsContent value="mine">
          <Card>
            <CardHeader>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>
                Your submitted referrals will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                This section is under development.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;