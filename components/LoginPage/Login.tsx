"use client";

import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LoginFormData {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, user } = data.data;

      // Set Cookies
      document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 days

      // Store user data in Zustand
      setUser(token, user);

      // Reset form
      formRef.current?.reset();

      // Redirect to Home
      router.replace("/");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Invalid credentials.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      identifier: formData.get("identifier") as string,
      password: formData.get("password") as string,
    };
    loginMutation.mutate(data);
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
        <LabelInputContainer>
          <Label htmlFor="identifier">Email or Username</Label>
          <Input
            id="identifier"
            name="identifier"
            placeholder="Enter your email or username"
            type="text"
            required
            disabled={loginMutation.isPending}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={loginMutation.isPending}
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium mt-4"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"} &rarr;
          <BottomGradient />
        </button>

        {loginMutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            {loginMutation.error?.response?.data?.message || "Login failed"}
          </p>
        )}

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
