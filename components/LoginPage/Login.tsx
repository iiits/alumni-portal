"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Zustand Store
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await axiosInstance.post("/auth/login", {
        identifier: data.identifier,
        password: data.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data.data;

        // Set Cookies
        document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 days

        // Store user data in Zustand
        setUser(token, user);

        // Redirect to Home
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(error.response?.data?.message || "Invalid credentials.");
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
        Login to connect and interact with current students
      </p>

      <form className="my-8" onSubmit={handleSubmit} ref={formRef}>
        {/* Username/Email/User ID Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="identifier">Email / Student ID</Label>
          <Input
            id="identifier"
            name="identifier"
            placeholder="Enter your college email, personal email, or Student ID"
            type="text"
            required
          />
        </LabelInputContainer>

        {/* Password Field */}
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

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"} &rarr;
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
