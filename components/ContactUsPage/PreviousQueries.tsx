"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/lib/api/axios"; 

interface ContactForm {
  subject: string;
  message: string;
  createdAt: string;
  resolved: boolean;
  resolutionMessage?: string;
}

export const PreviousQueries = () => {
  const [queries, setQueries] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axiosInstance.get("/contactus/user"); // frontend API route
        setQueries(res.data.data?.contactForms || []);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch your queries.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <p className="text-neutral-500 text-sm mt-6">
        You have not submitted any queries yet.
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Your Previous Queries
      </h3>
      {queries.map((q, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              {new Date(q.createdAt).toLocaleString()}
            </div>
            <div className="font-medium mt-1">{q.subject}</div>
            <p className="mt-1">{q.message}</p>
            <div className="mt-2 text-sm">
              <span
                className={`${
                  q.resolved ? "text-green-600" : "text-yellow-600"
                } font-medium`}
              >
                Status: {q.resolved ? "Resolved" : "Pending"}
              </span>
              {q.resolved && q.resolutionMessage && (
                <p className="mt-1 italic text-muted-foreground">
                  Admin Response: {q.resolutionMessage}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
