"use client";
import UserProfile from "@/components/ProfilePage/UserProfile";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Profile() {
  const { id } = useParams() as { id: string };

  if (!id) {
    toast.warning("User ID not found.");
    return <p className="text-center">User ID not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center m-3">
      <UserProfile userId={id} />
    </div>
  );
}
