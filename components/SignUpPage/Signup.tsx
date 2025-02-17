"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axios";

export function SignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: data.name,
        username: data.username,
        batch: data.batch,
        department: data.department,
        collegeEmail: data.collegeEmail,
        personalEmail: data.personalEmail,
        userId: data.rollNumber,
        password: data.password,
      });

      if (response.status === 201) {
        router.push("/emailverificationalert");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      setErrorMessage(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to IIITS Alumni Portal
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Sign up to connect and interact with current students
      </p>

      <form className="my-8" onSubmit={handleSubmit} ref={formRef}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Sam"
              type="text"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              name="username"
              placeholder="sam121"
              type="text"
              required
            />
          </LabelInputContainer>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="batch">Batch (Year)</Label>
            <Input
              id="batch"
              name="batch"
              type="number"
              placeholder="2022"
              min="2017"
              max={new Date().getFullYear()}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="department">Department</Label>
            <Select name="department">
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AIDS">AIDS</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="collegeEmail">College Email Address</Label>
          <Input
            id="collegeEmail"
            name="collegeEmail"
            placeholder="john.d22@iiits.in"
            pattern="^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@iiits\.in$"
            type="email"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="personalEmail">Personal Email Address</Label>
          <Input
            id="personalEmail"
            name="personalEmail"
            placeholder="johndoe@gmail.com"
            type="email"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="rollNumber">Student ID</Label>
          <Input
            id="rollNumber"
            name="rollNumber"
            placeholder="S20XX00X0XXX"
            type="text"
            pattern="^S\d{11}$"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="•••••••••••"
            type="password"
            required
          />
        </LabelInputContainer>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <button
          className="bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 w-full text-white rounded-md h-10 font-medium"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"} &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

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
