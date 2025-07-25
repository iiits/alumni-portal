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
  alumniDetails?: {
    verified: boolean;
    location: {
      city: string;
      country: string;
    };
    jobPosition: {
      title: string;
      company: string;
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
  };
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

      {/* Bio */}
      <p className="text-gray-700 text-lg border-l-4 pl-4 border-blue-500 italic">
        {data?.bio}
      </p>

      {/* Alumni Details */}
      {data.alumniDetails && data.alumniDetails?.verified && (
        <div className="space-y-6 border-t border-gray-200 pt-6">
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
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 [@media(max-width:425px)]:before:ml-3 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {data.alumniDetails.jobPosition
                .sort(
                  (a, b) =>
                    new Date(b.start).getTime() - new Date(a.start).getTime(),
                )
                .map((job, index) => (
                  <div key={index} className="relative flex items-start group">
                    <div className="absolute left-0 h-10 w-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                      <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
                    </div>
                    <div className="ml-12 [@media(max-width:425px)]:ml-8 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 [@media(max-width:425px)]:before:ml-3 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {data.alumniDetails.education
                .sort(
                  (a, b) =>
                    new Date(b.start).getTime() - new Date(a.start).getTime(),
                )
                .map((edu, index) => (
                  <div key={index} className="relative flex items-start group">
                    <div className="absolute left-0 h-10 w-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                      <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
                    </div>
                    <div className="ml-12 [@media(max-width:425px)]:ml-8 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold text-gray-800">
                          {edu.school}
                        </p>
                        <p className="text-md font-medium text-gray-700">
                          {edu.degree} in {edu.fieldOfStudy}
                        </p>
                        <p className="text-sm text-gray-600">{edu.location}</p>
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

export default UserProfile;
