"use client";
import UserProfile from "@/components/ProfilePage/UserProfile";
import { useParams } from "next/navigation";

export default function Profile() {
  const { id } = useParams() as { id: string }; // Get ID from URL

  if (!id) return <p className="text-center">User ID not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center m-3">
      <UserProfile userId={id} /> {/* Pass userId as a prop */}
    </div>
  );
}
