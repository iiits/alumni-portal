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
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SignupFormData {
  name: string;
  username: string;
  batch: string;
  department: string;
  collegeEmail: string;
  personalEmail: string;
  rollNumber: string;
  password: string;
}

export function SignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
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
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully. Please verify your email.");
      formRef.current?.reset();
      router.push("/auth/emailverificationalert");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      batch: formData.get("batch") as string,
      department: formData.get("department") as string,
      collegeEmail: formData.get("collegeEmail") as string,
      personalEmail: formData.get("personalEmail") as string,
      rollNumber: formData.get("rollNumber") as string,
      password: formData.get("password") as string,
    };
    signupMutation.mutate(data);
  };

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Create your account
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Join the IIITS Alumni network
      </p>

      <form onSubmit={handleSubmit} ref={formRef} className="my-8">
        <div className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              name="username"
              placeholder="JohnDoe2022"
              type="text"
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="batch">Batch (Year)</Label>
            <Input
              id="batch"
              name="batch"
              type="number"
              placeholder="2022"
              min="2014"
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

          <LabelInputContainer className="mb-4">
            <Label htmlFor="collegeEmail">College Email Address</Label>
            <Input
              id="collegeEmail"
              name="collegeEmail"
              placeholder="john.d22@iiits.in / john.d@iiits.in (for faculty)"
              pattern="^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@iiits\.in$|^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@iiits\.in$"
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
              placeholder="S20XX00X0XXX / F20XX00X0XXX (for faculty)"
              type="text"
              pattern="^S\d{11}$|^F\d{11}$"
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

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
          >
            {signupMutation.isPending ? "Creating Account..." : "Sign Up"}{" "}
            &rarr;
            <BottomGradient />
          </button>

          {signupMutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              {signupMutation.error?.response?.data?.message || "Signup failed"}
            </p>
          )}
        </div>

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
