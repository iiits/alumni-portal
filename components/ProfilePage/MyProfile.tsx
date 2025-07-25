"use client";
import React, { JSX, useState } from "react";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import Searching from "@/components/Commons/Searching";
import NoData from "@/components/Commons/NoData";

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
    company: string;
    type: "full-time" | "part-time" | "freelancer" | "intern" | "entrepreneur";
    start: string;
    end: string | null;
    ongoing: boolean;
    location: string;
    jobType: "on-site" | "remote" | "hybrid";
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
  const router = useRouter();

  const { data, error, isLoading } = useQuery<UserProfileData>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/me");
      return response.data.data;
    },
  });

  if (isLoading)
    return (
      <Searching
        message="Loading Profile..."
        description="Please wait while we fetch the Profile data."
      />
    );
  if (error)
    return (
      <NoData
        message="Error loading Profile"
        description="Please try again later."
        url="/user/me"
      />
    );
  if (!data)
    return (
      <NoData
        message="No Profile Data Found"
        description="Please check back later."
        url="/user/me"
      />
    );

  return (
    <div className="w-[80%] lg:w-[55%] mx-auto my-8 p-6 bg-white border border-gray-200 rounded-2xl flex flex-col space-y-6 transition-all duration-300">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
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
            <div className="w-28 h-28 bg-gray-200 rounded-full border-4 border-gray-200 flex items-center justify-center text-gray-500 text-6xl">
              {data?.name[0]}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight break-words">
            {data?.name}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mt-1 break-words">
            {data?.department} | Batch {data?.batch}
          </p>
        </div>
      </div>

      {/* Username */}
      <h3 className="text-xl font-semibold text-gray-800 text-center sm:text-left">
        a.k.a. {data?.username}
      </h3>

      {/* Edit Buttons */}
      <div className="flex flex-row flex-wrap items-center justify-start gap-2 sm:gap-4 [@media(max-width:425px)]:flex-col">
        <ModalProvider>
          <div className="w-full sm:w-auto">
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
          </div>
        </ModalProvider>

        {data.role === "student" && (
          <button
            className="w-full max-w-[300px] text-center sm:w-auto bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-sm"
            onClick={() => router.push("/alumnidetails")}
          >
            Register as Alumni
          </button>
        )}
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap gap-4">
        {data?.profiles &&
          data?.profiles.map(
            (profile, index) =>
              profile.visibility === "yes" && (
                <Link
                  key={index}
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  {socialIcons[profile.type]}
                </Link>
              ),
          )}
      </div>

      {/* Emails */}
      <div className="space-y-4 border-t border-gray-200 pt-4 text-gray-700">
        {/* College Email */}
        <div className="flex flex-col [@media(max-width:425px)]:items-start sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <span className="font-medium">College Email:</span>
          </div>
          <span className="text-left sm:ml-2">{data?.collegeEmail}</span>
        </div>

        {/* Personal Email */}
        <div className="flex flex-col [@media(max-width:425px)]:items-start sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <span className="font-medium">Personal Email:</span>
          </div>
          <span className="text-left sm:ml-2">{data?.personalEmail}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-lg border-l-4 pl-4 border-blue-500 italic">
        {data?.bio}
      </p>

      {/* Alumni Details */}
      {(data.role === "alumni" || data.role === "admin") &&
        data.alumniDetails && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {data.alumniDetails.verified === false && (
              <p className="text-yellow-700 font-medium bg-yellow-50 px-4 py-2 rounded-md border border-yellow-200">
                Alumni details verification in progress
              </p>
            )}

            {/* Edit Button */}
            <ModalProvider>
              <EditAlumniDetails
                alumniData={{
                  id: id || "",
                  location: {
                    city: data.alumniDetails.location.city || "",
                    country: data.alumniDetails.location.country || "",
                  },
                  jobPosition: data.alumniDetails.jobPosition.map((job) => ({
                    title: job.title,
                    company: job.company,
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

            {/* Location */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">
                Location
              </h4>
              <p className="text-gray-700">
                {data.alumniDetails.location.city},{" "}
                {data.alumniDetails.location.country}
              </p>
            </div>

            {/* Job Positions Timeline */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Career Timeline
              </h4>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {data.alumniDetails.jobPosition
                  .sort(
                    (a, b) =>
                      new Date(b.start).getTime() - new Date(a.start).getTime(),
                  )
                  .map((job, index) => (
                    <div
                      key={index}
                      className="relative flex items-start group"
                    >
                      <div className="absolute left-0 h-10 w-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                        <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
                      </div>
                      <div className="ml-12 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-semibold text-gray-800">
                            {job.title}
                          </p>
                          <p className="text-md text-black">
                            {job.company} • {job.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {job.location} • {job.jobType}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {job.ongoing
                              ? `${new Date(job.start).toLocaleDateString("en-US", { month: "long", year: "numeric" })} - Present`
                              : `${new Date(job.start).toLocaleDateString("en-US", { month: "long", year: "numeric" })} - ${job.end ? new Date(job.end).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Present"}`}
                          </p>
                          {job.description && (
                            <p className="text-gray-700 mt-2 leading-relaxed">
                              {job.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Education Timeline
              </h4>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {data.alumniDetails.education
                  .sort(
                    (a, b) =>
                      new Date(b.start).getTime() - new Date(a.start).getTime(),
                  )
                  .map((edu, index) => (
                    <div
                      key={index}
                      className="relative flex items-start group"
                    >
                      <div className="absolute left-0 h-10 w-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                        <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
                      </div>
                      <div className="ml-12 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-semibold text-gray-800">
                            {edu.school}
                          </p>
                          <p className="text-md font-medium text-gray-700">
                            {edu.degree} in {edu.fieldOfStudy}
                          </p>
                          <p className="text-sm text-gray-600">
                            {edu.location}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {edu.ongoing
                              ? `${new Date(edu.start).toLocaleDateString("en-US", { month: "long", year: "numeric" })} - Present`
                              : `${new Date(edu.start).toLocaleDateString("en-US", { month: "long", year: "numeric" })} - ${new Date(edu.end).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                          </p>
                          {edu.description && (
                            <p className="text-gray-700 mt-2 leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Expertise
              </h4>
              {data.alumniDetails.expertise?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.alumniDetails.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default MyProfile;
