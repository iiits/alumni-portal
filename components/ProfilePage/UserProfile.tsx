import React, { JSX } from "react";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import {
  SiX,
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiReddit,
  SiDiscord,
  SiGithub,
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";

interface SocialMediaProfile {
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

const socialIcons: Record<SocialMediaProfile["type"], JSX.Element> = {
  linkedin: <Linkedin className="w-6 h-6 text-blue-600 hover:text-blue-800" />,
  twitter: <SiX className="w-6 h-6 text-blue-400 hover:text-blue-600" />,
  github: <SiGithub className="w-6 h-6 text-gray-800 hover:text-gray-900" />,
  instagram: (
    <SiInstagram className="w-6 h-6 text-pink-500 hover:text-pink-700" />
  ),
  facebook: (
    <SiFacebook className="w-6 h-6 text-blue-700 hover:text-blue-900" />
  ),
  youtube: <SiYoutube className="w-6 h-6 text-red-600 hover:text-red-800" />,
  reddit: (
    <SiReddit className="w-6 h-6 text-orange-600 hover:text-orange-800" />
  ),
  discord: (
    <SiDiscord className="w-6 h-6 text-purple-600 hover:text-purple-800" />
  ),
};

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const token = useUserStore((state) => state.token);

  const { data, error, isLoading } = useQuery<UserProfileData>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!userId && !!token,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile data found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl flex flex-col space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <img
          src={data.profilePicture}
          alt={data.username}
          className="w-28 h-28 rounded-full border-4 border-gray-200"
        />

        {/* User Info */}
        <div className="text-left">
          <h2 className="text-2xl font-semibold">{data.username}</h2>
          <p className="text-gray-500 text-sm">
            {data.department} | Batch {data.batch}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <p className="text-gray-700 text-lg border-l-4 pl-4 border-blue-500">
        {data.bio}
      </p>

      {/* Social Media Links */}
      <div className="flex space-x-4">
        {data.profiles &&
          data.profiles.map(
            (profile, index) =>
              profile.visibility === "yes" && (
                <a
                  key={index}
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialIcons[profile.type]}
                </a>
              ),
          )}
      </div>

      {/* Emails */}
      <div className="space-y-2 border-t pt-4">
        <p className="flex items-center text-gray-700 text-sm">
          <Mail className="w-4 h-4 mr-2" /> <strong>College Email:</strong>{" "}
          {data.collegeEmail}
        </p>
        <p className="flex items-center text-gray-700 text-sm">
          <Mail className="w-4 h-4 mr-2" /> <strong>Personal Email:</strong>{" "}
          {data.personalEmail}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
