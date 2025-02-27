"use client";
import React, { JSX, useState } from "react";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
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
import EditUserDetails from "./EditUserDetails";
import EditAlumniDetails from "./EditAlumniDetails";
import { ModalProvider } from "../ui/animated-modal";

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

interface AlumniDetails {
  id: string;
  location: {
    city: string;
    country: string;
  };
  jobPosition: {
    title: string;
    type: string;
    start: string;
    end: string | null;
    ongoing: boolean;
    location: string;
    jobType: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    start: string;
    end: string;
    ongoing: boolean;
    location: string;
    description: string;
  }[];
  expertise: string[];
  verified: boolean;
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
  role: "student" | "alumni" | "admin";
  alumniDetails?: AlumniDetails;
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

const MyProfile: React.FC = () => {
  const id = useUserStore((state) => state.user?.id);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);

  const { data, error, isLoading } = useQuery<UserProfileData>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/me");
      return response.data.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile data found.</p>;
  return (
    <div className="w-full max-w-[95%] mx-auto p-6 bg-white shadow-lg rounded-2xl flex flex-col space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 min-w-0">
        {/* Profile Picture */}
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

        {/* User Info */}
        <div className="text-left min-w-0 flex-grow">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight break-words">
            {data?.name}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl break-words mt-2">
            {data?.department} | Batch {data?.batch}
          </p>
        </div>
      </div>
      {/* Username */}
      <h3 className="text-3xl font-semibold">a.k.a. {data?.username}</h3>
      {/* Edit Profile Button */}
      <ModalProvider>
        <EditUserDetails
          userData={{
            id: id || "",
            name: data.name,
            personalEmail: data.personalEmail,
            username: data.username,
            profiles: data.profiles.map((profile) => ({
              type: profile.type,
              link: profile.link,
              visibility: profile.visibility === "yes",
            })),
            bio: data.bio,
          }}
        />
      </ModalProvider>
      {data.role === "student" && (
        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Register as Alumni
        </button>
      )}
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

      {/* Emails and college Id */}
      <div className="space-y-3 border-t pt-4">
        <p>
          <Mail className="w-5 h-5" /> College Email: {data?.collegeEmail}
        </p>
        <p>
          <Mail className="w-5 h-5" /> Personal Email: {data?.personalEmail}
        </p>
      </div>

      {/* Bio Section */}
      <p className="text-gray-700 text-lg border-l-4 pl-4 border-blue-500">
        {data?.bio}
      </p>

      {/* Alumni Details */}
      {(data.role === "alumni" || data.role === "admin") &&
        data.alumniDetails && (
          <div className="space-y-4 border-t pt-4">
            {data.alumniDetails.verified === false && (
              <p className="text-yellow-600 font-semibold">
                Alumni details verification in progress
              </p>
            )}
            <ModalProvider>
              <EditAlumniDetails
                alumniData={{
                  id: data.alumniDetails.id || "",
                  location: {
                    city: data.alumniDetails.location.city || "",
                    country: data.alumniDetails.location.country || "",
                  },
                  jobPosition: data.alumniDetails.jobPosition.map((job) => ({
                    title: job.title,
                    type: job.type,
                    start: job.start,
                    end: job.end || null,
                    ongoing: job.ongoing,
                    location: job.location,
                    jobType: job.jobType,
                    description: job.description,
                  })),
                  education: data.alumniDetails.education.map((edu) => ({
                    school: edu.school,
                    degree: edu.degree,
                    fieldOfStudy: edu.fieldOfStudy,
                    start: edu.start,
                    end: edu.end,
                    ongoing: edu.ongoing,
                    location: edu.location,
                    description: edu.description,
                  })),
                  expertise: data.alumniDetails.expertise || [],
                }}
              />
            </ModalProvider>

            <p className="text-lg font-semibold">
              Location: {data.alumniDetails.location.city},{" "}
              {data.alumniDetails.location.country}
            </p>
            <div>
              <p className="text-lg font-semibold">Job Positions:</p>
              {data.alumniDetails.jobPosition.map((job, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <p className="text-gray-700">
                    {job.title} ({job.type})
                  </p>
                  <p className="text-gray-600">
                    {job.location} | {job.jobType}
                  </p>
                  <p className="text-gray-500">
                    {job.ongoing
                      ? "Ongoing"
                      : `${job.start.split("T")[0]} to ${job.end ? job.end.split("T")[0] : "Present"}`}
                  </p>
                  <p className="text-gray-500">{job.description}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-lg font-semibold">Education:</p>
              {data.alumniDetails.education.map((edu, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <p className="text-gray-700">
                    {edu.school} - {edu.degree} in {edu.fieldOfStudy}
                  </p>
                  <p className="text-gray-600">{edu.location}</p>
                  <p className="text-gray-500">
                    {edu.ongoing
                      ? "Ongoing"
                      : `${edu.start.split("T")[0]} to ${edu.end.split("T")[0]}`}
                  </p>
                  <p className="text-gray-500">{edu.description}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700">
              Expertise: {data.alumniDetails.expertise?.join(", ") || "N/A"}
            </p>
          </div>
        )}
    </div>
  );
};

export default MyProfile;
