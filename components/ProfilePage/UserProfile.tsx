import { axiosInstance } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NoData from "../Commons/NoData";
import Searching from "../Commons/Searching";
import { socialIcons } from "./SocialIcons";

export interface SocialMediaProfile {
  type:
    | "youtube"
    | "reddit"
    | "linkedin"
    | "twitter"
    | "instagram"
    | "facebook"
    | "discord"
    | "github";
  link: string;
  visibility: "yes" | "no";
}

interface UserProfileData {
  name: string;
  profilePicture: string;
  username: string;
  batch: string;
  department: string;
  bio: string;
  collegeEmail: string;
  personalEmail: string;
  profiles: SocialMediaProfile[];
}

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data, error, isLoading } = useQuery<UserProfileData>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/${userId}`, {});
      return response.data?.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Searching
        message="Loading Profile..."
        description="Please wait while we fetch the profile for you."
      />
    );
  }

  if (error) {
    return (
      <NoData
        message="Failed to load profile."
        description={error.message}
        url="/"
      />
    );
  }

  if (!data) {
    return (
      <NoData
        message="No Profile Found"
        description="The profile you are looking for does not exist."
        url="/"
      />
    );
  }

  return (
    <div className="w-full max-w-[95%] mx-auto p-6 bg-white shadow-lg rounded-2xl flex flex-col space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 min-w-0">
        {/* Profile Picture - Fixed size and shape */}
        <div className="flex-shrink-0">
          {data?.profilePicture ? (
            <Image
              src={data?.profilePicture}
              alt={data?.username}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full border-4 border-gray-200 object-cover"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-200 rounded-full border-4 border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-center h-full text-gray-500 text-6xl">
                {data?.name[0]}
              </div>
            </div>
          )}
        </div>

        {/* User Info - Flexible width with overflow handling */}
        <div className="text-left min-w-0 flex-grow">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight break-words">
            {data?.name}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl break-words mt-2">
            {data?.department} | Batch {data?.batch}
          </p>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-3xl font-semibold">a.k.a. {data?.username}</h3>

      {/* Social Media Links */}
      <div className="flex space-x-4">
        {data?.profiles &&
          data?.profiles.map(
            (profile, index) =>
              profile.visibility === "yes" && (
                <Link
                  key={index}
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialIcons[profile.type]}
                </Link>
              ),
          )}
      </div>

      {/* Emails */}
      <div className="space-y-3 border-t pt-4">
        <Link
          href={`mailto:${data?.collegeEmail}`}
          className="flex flex-wrap items-center text-gray-600 hover:text-gray-900 transition-colors gap-x-2.5"
        >
          <Mail className="w-5 h-5 flex-shrink-0" />
          <strong className="whitespace-nowrap">College Email:</strong>
          <span className="break-all">{data?.collegeEmail}</span>
        </Link>
        <Link
          href={`mailto:${data?.personalEmail}`}
          className="flex flex-wrap items-center text-gray-600 hover:text-gray-900 transition-colors gap-x-2.5"
        >
          <Mail className="w-5 h-5 flex-shrink-0" />
          <strong className="whitespace-nowrap">Personal Email:</strong>
          <span className="break-all">{data?.personalEmail}</span>
        </Link>
      </div>

      {/* Bio Section */}
      <p className="text-gray-700 text-lg border-l-4 pl-4 border-blue-500">
        {data?.bio}
      </p>
    </div>
  );
};

export default UserProfile;
