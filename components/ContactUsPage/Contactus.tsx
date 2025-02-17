"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/api/axios"; // Importing axios instance
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function ContactUs() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); // Initialize as "idle"
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("Form Data:", data);

    setStatus("loading"); // Set status to "loading" only when form is being submitted

    try {
      // Make the API call to submit the contact form
      const response = await axiosInstance.post("/contactus", data);

      if (response.status === 200) {
        setStatus("success");
        alert("Your message has been sent successfully!");
      } else {
        setStatus("error");
        setErrorMessage(response.data?.message || "Failed to submit message.");
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setStatus("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="mt-12 max-w-2xl w-full mx-auto rounded-lg p-8 shadow-md bg-white dark:bg-gray-900 min-h-[600px]">
      <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">
        Contact Us
      </h2>
      <p className="text-gray-600 text-sm mt-2 dark:text-gray-400">
        We&apos;d love to hear from you! Please fill out the form below.
      </p>

      <form className="mt-6" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="your@email.com"
            type="email"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            type="text"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="subject">Subject</Label>
          <Select name="subject" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support">
                Technical Support & Portal Assistance
              </SelectItem>
              <SelectItem value="events">Events & Reunions</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="academic">
                Academic Support & Resources
              </SelectItem>
              <SelectItem value="general">General Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Enter your message here..."
            rows={6}
            required
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 w-full text-white rounded-md h-12 font-medium"
          type="submit"
        >
          Submit
        </button>
      </form>

      {/* Conditional Feedback */}
      {status === "loading" && <p>Submitting your message...</p>}
      {status === "error" && <p className="text-red-500">{errorMessage}</p>}
      {status === "success" && (
        <p className="text-green-500">
          Your message was successfully submitted!
        </p>
      )}
    </div>
  );
}

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
