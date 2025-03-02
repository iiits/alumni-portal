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
import MyReferrals from "./MyReferrals";
import ReferralCard from "./ReferralCard";
import ReferralFilter from "./ReferralFilter";
import MySubmissions from "./ReferralSubmission.tsx/MySubmissions";
import { Referral, ReferralFilters } from "./types";

export default function Referrals() {
  const { user } = useUserStore();

  const [appliedFilters, setAppliedFilters] = useState<ReferralFilters>({
    month: "",
    year: "",
  });

  const [currentFilters, setCurrentFilters] = useState<ReferralFilters>({
    month: "",
    year: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery<Referral[]>({
    queryKey: ["referrals", appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFilters.month)
        params.append("month", String(appliedFilters.month));
      if (appliedFilters.year)
        params.append("year", String(appliedFilters.year));

      const response = await axiosInstance.get("/referrals/filter", { params });
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
        <h2 className="text-3xl sm:text-4xl font-semibold">Referrals</h2>
        {(user?.role === "alumni" || user?.role === "admin") && (
          <CreateNew
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            refetch={refetch}
          />
        )}
      </div>

      <Tabs defaultValue="all" className="w-[90vw] mx-auto pb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-lg">
            All Referrals
          </TabsTrigger>
          <TabsTrigger value="mine" className="text-lg">
            My Referral Posts
          </TabsTrigger>
          <TabsTrigger value="submissions" className="text-lg">
            My Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                All Referrals
              </CardTitle>
              <CardDescription className="text-lg sm:text-xl">
                Browse and filter referral opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralFilter
                filters={currentFilters}
                setFilters={setCurrentFilters}
                onFilterChange={handleFilterChange}
                isChanged={isFilterChanged}
              />

              {isLoading && (
                <Searching
                  message="Loading Referrals..."
                  description="Fetching referral opportunities for you."
                />
              )}

              {error && (
                <NoData
                  message="Failed to load referrals."
                  description="An error occurred while fetching data."
                  url="/"
                />
              )}

              {!isLoading && !error && (!data || data.length === 0) && (
                <NoData
                  message="No Referrals Found"
                  description="No referrals match your criteria."
                  url="/"
                />
              )}

              {!isLoading && !error && data && data.length > 0 && (
                <div className="space-y-4">
                  {data.map((referral) => (
                    <ReferralCard key={referral.id} referral={referral} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mine">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                My Referral Posts
              </CardTitle>
              <CardDescription className="text-lg sm:text-xl">
                Manage your referral postings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyReferrals />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                My Applications
              </CardTitle>
              <CardDescription className="text-lg sm:text-xl">
                Track your referral submissions and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MySubmissions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
