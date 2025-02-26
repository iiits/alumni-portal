"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import CreateReferral from "./CreateReferrals";
import MyReferrals from "./MyReferrals";

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

export default function ReferralsTabs() {
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleFilterChange = () => {
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-10">
        <h2 className="text-lg font-semibold">Job Referrals</h2>
        <CreateReferral
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSuccess={refetch}
        />
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

        {/* My Referrals Tab */}
        <TabsContent value="mine">
          <MyReferrals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
