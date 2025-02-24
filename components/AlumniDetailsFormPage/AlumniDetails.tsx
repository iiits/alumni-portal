"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { axiosInstance } from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { PlusCircle, X } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";

interface JobPositionData {
  title: string;
  type: "full-time" | "part-time" | "freelancer" | "intern" | "entrepreneur";
  start: string;
  end?: string | null;
  ongoing: boolean;
  location: string;
  jobType: "on-site" | "remote" | "hybrid";
  description?: string;
}

interface EducationData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  start: string;
  end?: string | null;
  ongoing: boolean;
  location: string;
  description?: string;
}

interface LocationData {
  city: string;
  country: string;
}

// This interface represents the data structure expected by the API
interface AlumniDetailsPayload {
  id: string;
  jobPosition: JobPositionData[];
  education: EducationData[];
  location: LocationData;
  expertise: string[];
  verified: boolean;
}

export function AlumniDetailsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [jobAlert, setJobAlert] = useState(false);
  const [educationAlert, setEducationAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { user } = useUserStore();
  const userId = user?.id;

  // State for multiple jobs and education entries
  const [jobs, setJobs] = useState<
    { data: Partial<JobPositionData>; ongoing: boolean }[]
  >([{ data: {}, ongoing: false }]);

  const [education, setEducation] = useState<
    { data: Partial<EducationData>; ongoing: boolean }[]
  >([{ data: {}, ongoing: false }]);
  const validatePayload = (
    payload: AlumniDetailsPayload,
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check id
    if (!payload.id) {
      errors.push("User ID is required");
    }

    // Check jobPosition array
    if (
      !Array.isArray(payload.jobPosition) ||
      payload.jobPosition.length === 0
    ) {
      errors.push("At least one job position is required");
    } else {
      payload.jobPosition.forEach((job, index) => {
        if (!job.title) errors.push(`Job ${index + 1}: Title is required`);
        if (!job.type) errors.push(`Job ${index + 1}: Type is required`);
        if (!job.start) errors.push(`Job ${index + 1}: Start date is required`);
        if (!job.location)
          errors.push(`Job ${index + 1}: Location is required`);
        if (!job.jobType) errors.push(`Job ${index + 1}: Job type is required`);
        // Check if end date is required when not ongoing
        if (!job.ongoing && !job.end)
          errors.push(
            `Job ${index + 1}: End date is required when not ongoing`,
          );
      });
    }

    // Check education array
    if (!Array.isArray(payload.education) || payload.education.length === 0) {
      errors.push("At least one education entry is required");
    } else {
      payload.education.forEach((edu, index) => {
        if (!edu.school)
          errors.push(`Education ${index + 1}: School is required`);
        if (!edu.degree)
          errors.push(`Education ${index + 1}: Degree is required`);
        if (!edu.fieldOfStudy)
          errors.push(`Education ${index + 1}: Field of study is required`);
        if (!edu.start)
          errors.push(`Education ${index + 1}: Start date is required`);
        if (!edu.location)
          errors.push(`Education ${index + 1}: Location is required`);
        // Check if end date is required when not ongoing
        if (!edu.ongoing && !edu.end)
          errors.push(
            `Education ${index + 1}: End date is required when not ongoing`,
          );
      });
    }

    // Check location
    if (!payload.location.city) errors.push("City is required");
    if (!payload.location.country) errors.push("Country is required");

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const convertToISODate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Map job positions with date conversion
    const jobPosition: JobPositionData[] = jobs.map((job, index) => {
      const title = formData.get(`jobTitle-${index}`)?.toString().trim();
      const type = formData
        .get(`jobType-${index}`)
        ?.toString() as JobPositionData["type"];
      const startDate = formData.get(`jobStart-${index}`)?.toString();
      const endDate = job.ongoing
        ? null
        : formData.get(`jobEnd-${index}`)?.toString();
      const location = formData.get(`jobLocation-${index}`)?.toString().trim();
      const jobType = formData
        .get(`workMode-${index}`)
        ?.toString() as JobPositionData["jobType"];

      if (!title || !type || !startDate || !location || !jobType) {
        throw new Error(
          `All fields are required for job position ${index + 1}`,
        );
      }

      const jobData: JobPositionData = {
        title,
        type,
        start: convertToISODate(startDate)!, // Convert to ISO string
        end: endDate ? convertToISODate(endDate) : null,
        ongoing: job.ongoing,
        location,
        jobType,
        description:
          formData.get(`jobDescription-${index}`)?.toString().trim() ||
          undefined,
      };
      return jobData;
    });

    // Map education with date conversion
    const educationData: EducationData[] = education.map((edu, index) => {
      const school = formData.get(`school-${index}`)?.toString().trim();
      const degree = formData.get(`degree-${index}`)?.toString().trim();
      const fieldOfStudy = formData
        .get(`fieldOfStudy-${index}`)
        ?.toString()
        .trim();
      const startDate = formData.get(`educationStart-${index}`)?.toString();
      const endDate = edu.ongoing
        ? null
        : formData.get(`educationEnd-${index}`)?.toString();
      const location = formData
        .get(`educationLocation-${index}`)
        ?.toString()
        .trim();

      if (!school || !degree || !fieldOfStudy || !startDate || !location) {
        throw new Error(`All fields are required for education ${index + 1}`);
      }

      const eduData: EducationData = {
        school,
        degree,
        fieldOfStudy,
        start: convertToISODate(startDate)!, // Convert to ISO string
        end: endDate ? convertToISODate(endDate) : null,
        ongoing: edu.ongoing,
        location,
        description:
          formData.get(`educationDescription-${index}`)?.toString().trim() ||
          undefined,
      };
      return eduData;
    });

    if (!userId) {
      console.error("No user ID found");
      alert("User is not logged in. Please log in first.");
      return;
    }

    const city = formData.get("city")?.toString().trim();
    const country = formData.get("country")?.toString().trim();

    if (!city || !country) {
      alert("City and country are required");
      return;
    }

    const payload: AlumniDetailsPayload = {
      id: userId,
      jobPosition,
      education: educationData,
      location: {
        city,
        country,
      },
      expertise: expertise,
      verified: false,
    };

    try {
      alumniMutation.mutate(payload);
    } catch (error) {
      console.error("Validation error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the form",
      );
    }
  };

  const alumniMutation = useMutation({
    mutationFn: async (data: AlumniDetailsPayload) => {
      const token = useUserStore.getState().token;

      if (!token) {
        throw new Error("Unauthorized: No token available.");
      }

      try {
        const response = await axiosInstance.post("/alumnidetails", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("API Error Details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        // Extract the error message from the response
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save details";

        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      toast.success("Your details have been sent successfully!");
      router.replace("/");
    },
    onError: (error: any) => {
      // Detailed error logging
      toast.error(
        error.response?.data?.message || "Alumni details submission failed",
      );
      console.error("Mutation error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Show a more informative error message to the user
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      alert(errorMessage);
    },
  });

  const handleAddExpertise = () => {
    if (
      expertiseInput.trim() !== "" &&
      !expertise.includes(expertiseInput.trim())
    ) {
      setExpertise([...expertise, expertiseInput.trim()]);
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (skill: string) => {
    setExpertise(expertise.filter((item) => item !== skill));
  };

  const addNewJob = () => {
    // Check if all required fields in the last job entry are filled
    const lastJob = jobs[jobs.length - 1];
    const formData = new FormData(formRef.current!);
    const lastIndex = jobs.length - 1;

    const requiredFields = [
      `jobTitle-${lastIndex}`,
      `jobType-${lastIndex}`,
      `jobStart-${lastIndex}`,
      `jobLocation-${lastIndex}`,
      `workMode-${lastIndex}`,
    ];

    const allFieldsFilled = requiredFields.every((field) =>
      formData.get(field),
    );

    if (!allFieldsFilled) {
      setAlertMessage(
        "Please fill in all required fields in the current job entry before adding a new one.",
      );
      setJobAlert(true);
      setEducationAlert(false);
      setTimeout(() => setJobAlert(false), 5000);
      return;
    }

    setJobs([...jobs, { data: {}, ongoing: false }]);
  };

  const addNewEducation = () => {
    // Check if all required fields in the last education entry are filled
    const lastIndex = education.length - 1;
    const formData = new FormData(formRef.current!);

    const requiredFields = [
      `school-${lastIndex}`,
      `degree-${lastIndex}`,
      `fieldOfStudy-${lastIndex}`,
      `educationStart-${lastIndex}`,
      `educationLocation-${lastIndex}`,
    ];

    const allFieldsFilled = requiredFields.every((field) =>
      formData.get(field),
    );

    if (!allFieldsFilled) {
      setAlertMessage(
        "Please fill in all required fields in the current education entry before adding a new one.",
      );
      setEducationAlert(true);
      setJobAlert(false);
      setTimeout(() => setEducationAlert(false), 5000);
      return;
    }

    setEducation([...education, { data: {}, ongoing: false }]);
  };

  const removeJob = (index: number) => {
    if (jobs.length === 1) return;
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const removeEducation = (index: number) => {
    if (education.length === 1) return;
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-8 mb-8 max-w-3xl w-full mx-auto border border-gray-300 dark:border-gray-700 rounded-lg p-6 md:p-8 shadow-lg bg-white dark:bg-black">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 text-center">
        Alumni Details Form
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mx-auto mt-2 mb-8 text-center dark:text-neutral-300">
        Fill in your job, education, expertise, and location details.
      </p>

      <form onSubmit={handleSubmit} ref={formRef} className="space-y-12">
        {" "}
        {/* Increased space between sections */}
        <div className="space-y-8">
          {" "}
          {/* Increased space between major sections */}
          {/* Job Sections */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                Job Positions
              </h3>
              <Button
                type="button"
                onClick={addNewJob}
                className="flex items-center gap-2"
                variant="outline"
              >
                <PlusCircle className="w-4 h-4" />
                Add Job
              </Button>
            </div>
            {jobAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-8">
              {" "}
              {/* Space between job entries */}
              {Array.isArray(jobs) &&
                jobs.map((job, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6"
                  >
                    {jobs.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeJob(index)}
                        variant="ghost"
                        className="absolute right-2 top-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}

                    <div className="space-y-6">
                      {" "}
                      {/* Space between fields within a job entry */}
                      <LabelInputContainer>
                        <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                        <Input
                          id={`jobTitle-${index}`}
                          name={`jobTitle-${index}`}
                          placeholder="Software Engineer"
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`jobType-${index}`}>
                          Employment Type
                        </Label>
                        <Select name={`jobType-${index}`}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-Time</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                            <SelectItem value="freelancer">
                              Freelancer
                            </SelectItem>
                            <SelectItem value="intern">Intern</SelectItem>
                            <SelectItem value="entrepreneur">
                              Entrepreneur
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </LabelInputContainer>
                      <div className="flex flex-col md:flex-row gap-6">
                        {" "}
                        {/* Increased gap between side-by-side fields */}
                        <LabelInputContainer className="w-full">
                          <Label htmlFor={`jobStart-${index}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`jobStart-${index}`}
                            name={`jobStart-${index}`}
                            type="date"
                            required
                          />
                        </LabelInputContainer>
                        <LabelInputContainer className="w-full">
                          <Label htmlFor={`jobEnd-${index}`}>End Date</Label>
                          <Input
                            id={`jobEnd-${index}`}
                            name={`jobEnd-${index}`}
                            type="date"
                            disabled={job.ongoing}
                            className={
                              job.ongoing
                                ? "bg-gray-200 cursor-not-allowed dark:bg-gray-700"
                                : ""
                            }
                          />
                        </LabelInputContainer>
                      </div>
                      <LabelInputContainer>
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox
                            id={`ongoingJob-${index}`}
                            checked={job.ongoing}
                            onCheckedChange={(checked) => {
                              const newJobs = [...jobs];
                              newJobs[index].ongoing = !!checked;
                              setJobs(newJobs);
                            }}
                          />
                          <Label htmlFor={`ongoingJob-${index}`}>Ongoing</Label>
                        </div>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`jobLocation-${index}`}>
                          Job Location
                        </Label>
                        <Input
                          id={`jobLocation-${index}`}
                          name={`jobLocation-${index}`}
                          placeholder="New York, USA"
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`workMode-${index}`}>Work Type</Label>
                        <Select name={`workMode-${index}`}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Work Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-site">On-Site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`jobDescription-${index}`}>
                          Job Description
                        </Label>
                        <textarea
                          id={`jobDescription-${index}`}
                          name={`jobDescription-${index}`}
                          placeholder="Describe your job role..."
                          className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] dark:bg-gray-900 dark:text-white"
                        />
                      </LabelInputContainer>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Education Sections */}
          <div className="space-y-4 pt-2">
            {" "}
            {/* Added top padding for section separation */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                Education
              </h3>
              <Button
                type="button"
                onClick={addNewEducation}
                className="flex items-center gap-2"
                variant="outline"
              >
                <PlusCircle className="w-4 h-4" />
                Add Education
              </Button>
            </div>
            {educationAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-8">
              {" "}
              {/* Space between education entries */}
              {Array.isArray(education) &&
                education.map((edu, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6"
                  >
                    {education.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        variant="ghost"
                        className="absolute right-2 top-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}

                    <div className="space-y-6">
                      {" "}
                      {/* Space between fields within an education entry */}
                      <LabelInputContainer>
                        <Label htmlFor={`school-${index}`}>
                          School / University
                        </Label>
                        <Input
                          id={`school-${index}`}
                          name={`school-${index}`}
                          placeholder="Harvard University"
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          name={`degree-${index}`}
                          placeholder="BSc in Computer Science"
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`fieldOfStudy-${index}`}>
                          Field of Study
                        </Label>
                        <Input
                          id={`fieldOfStudy-${index}`}
                          name={`fieldOfStudy-${index}`}
                          placeholder="Computer Science"
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`educationLocation-${index}`}>
                          Location
                        </Label>
                        <Input
                          id={`educationLocation-${index}`}
                          name={`educationLocation-${index}`}
                          placeholder="Cambridge, MA, USA"
                          required
                        />
                      </LabelInputContainer>
                      <div className="flex flex-col md:flex-row gap-6">
                        <LabelInputContainer className="w-full">
                          <Label htmlFor={`educationStart-${index}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`educationStart-${index}`}
                            name={`educationStart-${index}`}
                            type="date"
                            required
                          />
                        </LabelInputContainer>

                        <LabelInputContainer className="w-full">
                          <Label htmlFor={`educationEnd-${index}`}>
                            End Date
                          </Label>
                          <Input
                            id={`educationEnd-${index}`}
                            name={`educationEnd-${index}`}
                            type="date"
                            disabled={edu.ongoing}
                            className={
                              edu.ongoing
                                ? "bg-gray-200 cursor-not-allowed dark:bg-gray-700"
                                : ""
                            }
                          />
                        </LabelInputContainer>
                      </div>
                      <LabelInputContainer>
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox
                            id={`ongoingEducation-${index}`}
                            checked={edu.ongoing}
                            onCheckedChange={(checked) => {
                              const newEducation = [...education];
                              newEducation[index].ongoing = !!checked;
                              setEducation(newEducation);
                            }}
                          />
                          <Label htmlFor={`ongoingEducation-${index}`}>
                            Ongoing
                          </Label>
                        </div>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor={`educationDescription-${index}`}>
                          Education Description
                        </Label>
                        <textarea
                          id={`educationDescription-${index}`}
                          name={`educationDescription-${index}`}
                          placeholder="Describe your education..."
                          className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] dark:bg-gray-900 dark:text-white"
                        />
                      </LabelInputContainer>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Expertise Section */}
          <div className="pt-2 space-y-2">
            {" "}
            {/* Added padding and spacing */}
            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 border-b border-gray-200 dark:border-gray-700 pb-4">
              Expertise
            </h3>
            <div className="flex gap-2">
              <Input
                id="expertiseInput"
                name="expertiseInput"
                placeholder="Add skills (e.g., React, Machine Learning)"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddExpertise}
                className="bg-gradient-to-br from-black to-neutral-600 text-white"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(expertise) &&
                expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(skill)}
                      className="ml-2 text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
            </div>
          </div>
          {/* Location Section */}
          <div className="pt-2 space-y-2">
            {" "}
            {/* Added padding and spacing */}
            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 border-b border-gray-200 dark:border-gray-700 pb-4">
              Current Location
            </h3>
            <LabelInputContainer>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="New York" required />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" placeholder="USA" required />
            </LabelInputContainer>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={alumniMutation.isPending}
            className="bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium mt-8"
          >
            {alumniMutation.isPending ? "Submitting..." : "Submit Details"}{" "}
            &rarr;
          </Button>
          {alumniMutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              {alumniMutation.error?.response?.data?.message ||
                "Submission failed"}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
