"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { handleLogout } from "./handleLogout";

export default function Logout() {
  const onLogout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="container px-4 flex flex-col items-center">
        {/* Confirmation GIF */}
        <Image
          src="/gifs/yes_no.gif"
          alt="Confirm Logout"
          width={500}
          height={500}
        />

        {/* Description */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl mb-4">
            Are you sure you want to logout?
          </h2>
          <p className="text-gray-600 mb-8">
            You&apos;ll need to sign in again to access your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onLogout}
            variant="destructive"
            className="flex items-center space-x-2 px-6 py-2 rounded transition duration-150 text-base h-full"
          >
            <span>Yes, Logout</span>
          </Button>

          <Link
            href="/"
            className="flex items-center space-x-2 bg-neutral-500 hover:bg-neutral-700 text-white px-6 py-2 rounded transition duration-150"
          >
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
