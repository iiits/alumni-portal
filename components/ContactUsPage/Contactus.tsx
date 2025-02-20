"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface ContactFormData {
  subject: string;
  message: string;
}

export function ContactUs() {
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await axiosInstance.post("/contactus", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Your message has been sent successfully!");
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
  };

  const subjects = [
    {
      label: "General Inquiry",
      value: "general",
    },
    {
      label: "Technical Support",
      value: "support",
    },
    {
      label: "Feedback",
      value: "feedback",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Contact Us
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
              contactMutation.isPending && "opacity-50"
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

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
