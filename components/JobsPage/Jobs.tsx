"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import CreateNew from "./CreateNew";
import JobsCard from "./JobsCard";
import JobsFilter from "./JobsFilter";
import MyJobs from "./MyJobs";
import { Job, JobFilters } from "./types";

export default function Jobs() {
  const { user } = useUserStore();

  const [appliedFilters, setAppliedFilters] = useState<JobFilters>({
    month: "",
    year: "",
    type: "",
    workType: "",
    batch: [],
  });

  const [currentFilters, setCurrentFilters] = useState<JobFilters>({
    month: "",
    year: "",
    type: "",
    workType: "",
    batch: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery<Job[]>({
    queryKey: ["jobs", appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFilters.month)
        params.append("month", String(appliedFilters.month));
      if (appliedFilters.year)
        params.append("year", String(appliedFilters.year));
      if (appliedFilters.type) params.append("type", appliedFilters.type);
      if (appliedFilters.workType)
        params.append("workType", appliedFilters.workType);
      if (appliedFilters.batch.length) {
        appliedFilters.batch.forEach((batch) => params.append("batch", batch));
      }

      const response = await axiosInstance.get("/jobs/filter", { params });
      return response.data?.data;
    },
  });

  const handleFilterChange = () => {
    setAppliedFilters(currentFilters);
  };

  const isFilterChanged =
    JSON.stringify(appliedFilters) !== JSON.stringify(currentFilters);

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4 pt-10">
        <h2 className="text-3xl sm:text-4xl font-semibold">Jobs</h2>
        {(user?.role === "admin" || user?.role === "alumni") && (
          <CreateNew
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            refetch={refetch}
          />
        )}
      </div>

      <Tabs defaultValue="all" className="w-[90vw] mx-auto pb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="text-lg">
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="mine" className="text-lg">
            My Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">All Jobs</CardTitle>
              <CardDescription className="text-lg sm:text-xl">
                Browse and filter job postings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobsFilter
                filters={currentFilters}
                setFilters={setCurrentFilters}
                onFilterChange={handleFilterChange}
                isChanged={isFilterChanged}
              />

              {isLoading && (
                <Searching
                  message="Loading Jobs..."
                  description="Fetching job postings for you."
                />
              )}

              {error && (
                <NoData
                  message="Failed to load jobs."
                  description="An error occurred while fetching data."
                  url="/"
                />
              )}

              {!isLoading && !error && (!data || data.length === 0) && (
                <NoData
                  message="No Jobs Available"
                  description="No job postings match your criteria."
                  url="/"
                />
              )}

              <div className="space-y-4">
                {data?.map((job) => <JobsCard key={job.id} job={job} />)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mine">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">My Jobs</CardTitle>
              <CardDescription className="text-lg sm:text-xl">
                Job postings you have created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyJobs />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
