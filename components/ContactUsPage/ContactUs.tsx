"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Interface for previous query data
interface PreviousQuery {
  subject: string;
  message: string;
  createdAt: string;
  resolved: boolean;
  resolutionMessage?: string;
}

// Interface for new contact form submission data
interface ContactFormData {
  subject: string;
  message: string;
}

// Component to fetch and display previous queries
const PreviousQueriesList = () => {
  const [queries, setQueries] = useState<PreviousQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axiosInstance.get("/contactus/user");
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
    <div className="mt-6 space-y-4">
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

// Main component with Tabs
export function ContactUs() {
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await axiosInstance.post("/contactus/submit", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Your message has been sent successfully!");
      // Note: You might want to add logic to refetch queries after a successful submission
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    contactMutation.mutate(data);
    (e.target as HTMLFormElement).reset();
  };

  const subjects = [
    { label: "General Inquiry", value: "general" },
    { label: "Technical Support", value: "support" },
    { label: "Feedback", value: "feedback" },
    { label: "Other", value: "other" },
  ];

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <Tabs defaultValue="contact-us" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact-us">Contact Us</TabsTrigger>
          <TabsTrigger value="previous-queries">Previous Queries</TabsTrigger>
        </TabsList>

        {/* Contact Us Form Tab */}
        <TabsContent value="contact-us">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mt-6">
            Get in Touch
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Have a question? We&apos;d love to hear from you.
          </p>
          <form onSubmit={handleSubmit} className="my-8">
            <LabelInputContainer className="mb-4">
              <label className="text-neutral-800 dark:text-neutral-200">
                Reason for Contact
              </label>
              <Select name="subject" required>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800">
                  <SelectValue placeholder="Select reason for contact" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <label className="text-neutral-800 dark:text-neutral-200">
                Your Message
              </label>
              <Textarea
                placeholder="Type your message here"
                name="message"
                required
                className={cn(
                  "min-h-[150px] resize-none bg-white dark:bg-zinc-800",
                  contactMutation.isPending && "opacity-50",
                )}
                disabled={contactMutation.isPending}
              />
            </LabelInputContainer>
            <button
              type="submit"
              disabled={contactMutation.isPending}
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"} &rarr;
              <BottomGradient />
            </button>
          </form>
        </TabsContent>

        {/* Previous Queries Tab */}
        <TabsContent value="previous-queries">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mt-6">
            Your Previous Queries
          </h2>
          <PreviousQueriesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

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
