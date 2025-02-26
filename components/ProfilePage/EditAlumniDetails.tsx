"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  useModal,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
}

interface EditAlumniDetailsProps {
  alumniData: AlumniDetails;
}

const EditAlumniDetails: React.FC<EditAlumniDetailsProps> = ({
  alumniData,
}) => {
  const router = useRouter();
  const { open, setOpen } = useModal();
  const [formData, setFormData] = useState(alumniData);
  const [isLoading, setIsLoading] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: Omit<AlumniDetails, "id">) => {
      setIsLoading(true);
      return axiosInstance.put(`/alumnidetails/${alumniData.id}`, data);
    },
    onSuccess: () => {
      toast.success("Alumni details updated successfully!");
      setIsLoading(false);
      setOpen(false);
      setTimeout(() => {
        router.refresh();
      }, 200);
    },
    onError: (error) => {
      toast.error("Error updating alumni details: " + error.message);
      setIsLoading(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      location: { ...formData.location, [e.target.name]: e.target.value },
    });
  };

  const handleArrayChange = (
    field: string,
    index: number,
    key: string,
    value: any,
  ) => {
    const updatedArray = [...(formData as any)[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };
  const addNewJob = () => {
    setFormData((prev) => ({
      ...prev,
      jobPosition: [
        ...prev.jobPosition,
        {
          title: "",
          type: "",
          start: "",
          end: null,
          ongoing: false,
          location: "",
          jobType: "",
          description: "",
        }
      ]
    }));
  };
  
  const removeJob = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      jobPosition: prev.jobPosition.filter((_, i) => i !== index)
    }));
  };
  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };
  
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          start: "",
          end: "",
          ongoing: false,
          location: "",
          description: "",
        },
      ],
    }));
  };
  
  const addExpertise = () => {
    if (newExpertise.trim() !== "") {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, newExpertise.trim()],
      });
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    const updatedExpertise = formData.expertise.filter((_, i) => i !== index);
    setFormData({ ...formData, expertise: updatedExpertise });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div>
      <Modal>
        <ModalTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {isLoading ? "Updating..." : "Edit Alumni Details"}
        </ModalTrigger>
        <ModalBody className="max-h-[80vh] overflow-y-auto p-4">
          <ModalContent>
            <h2 className="text-xl font-bold mb-4">Edit Alumni Details</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Location */}
              <div>
                <label className="block font-semibold">City</label>
                <input
                  name="city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold">Country</label>
                <input
                  name="country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Job Positions */}
              <h3 className="font-semibold">Job Positions</h3>
              {formData.jobPosition.map((job, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-md mb-4">
                  {/* Title */}
                  <label className="block font-semibold">Title</label>
                  <input
                    value={job.title}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "title", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Type */}
                  <label className="block font-semibold mt-2">Type</label>
                  <input
                    value={job.type}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "type", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Company / Location */}
                  <label className="block font-semibold mt-2">Company</label>
                  <input
                    value={job.location}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "location", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Job Type */}
                  <label className="block font-semibold mt-2">Job Type</label>
                  <input
                    value={job.jobType}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "jobType", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Start Date */}
                  <label className="block font-semibold mt-2">Start Date</label>
                  <input
                    type="date"
                    value={job.start ? new Date(job.start).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "start", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />


                  {/* End Date (Hidden if ongoing) */}
                  {!job.ongoing && (
                    <>
                      <label className="block font-semibold mt-2">End Date</label>
                      <input
                        type="date"
                        value={job.end ? new Date(job.end).toISOString().split("T")[0] : ""}
                        onChange={(e) =>
                          handleArrayChange("jobPosition", index, "end", e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </>
                  )}

                  {/* Ongoing Checkbox */}
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={job.ongoing}
                      onChange={(e) =>
                        handleArrayChange("jobPosition", index, "ongoing", e.target.checked)
                      }
                    />
                    <span className="ml-2">Ongoing</span>
                  </label>

                  {/* Job Description */}
                  <label className="block font-semibold mt-2">Job Description</label>
                  <textarea
                    value={job.description}
                    onChange={(e) =>
                      handleArrayChange("jobPosition", index, "description", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Remove Job Button */}
                  <button
                    type="button"
                    onClick={() => removeJob(index)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove Job
                  </button>
                </div>
              ))}

              {/* Add New Job Button */}
              <button
                type="button"
                onClick={addNewJob}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                + Add Job Position
              </button>

              {/* Education */}
              <h3 className="font-semibold">Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-md space-y-2">
                  {/* School */}
                  <label className="block font-semibold">School</label>
                  <input
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayChange("education", index, "school", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Degree */}
                  <label className="block font-semibold">Degree</label>
                  <input
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayChange("education", index, "degree", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Field of Study */}
                  <label className="block font-semibold">Field of Study</label>
                  <input
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      handleArrayChange("education", index, "fieldOfStudy", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Start Date */}
                  <label className="block font-semibold">Start Date</label>
                  <input
                    type="date"
                    value={edu.start ? new Date(edu.start).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "start", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* End Date */}
                  <label className="block font-semibold">End Date</label>
                  <input
                    type="date"
                    value={edu.end ? new Date(edu.end).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "end", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    disabled={edu.ongoing} // Disable end date if ongoing
                  />

                  {/* Ongoing Checkbox */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={edu.ongoing}
                      onChange={(e) =>
                        handleArrayChange("education", index, "ongoing", e.target.checked)
                      }
                    />
                    <span>Ongoing</span>
                  </label>

                  {/* Location */}
                  <label className="block font-semibold">Location</label>
                  <input
                    value={edu.location}
                    onChange={(e) =>
                      handleArrayChange("education", index, "location", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Description */}
                  <label className="block font-semibold">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) =>
                      handleArrayChange("education", index, "description", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Remove Button */}
                  <button onClick={() => removeEducation(index)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">
                    Remove Education
                  </button>
                </div>
              ))}

              {/* Add New Education Button */}
              <button onClick={addEducation} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                Add New Education
              </button>


              {/* Expertise */}
              <div>
                <h3 className="font-semibold">Expertise</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.expertise.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                    >
                      <span>{exp}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="ml-2 text-red-600 font-bold"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Add new expertise"
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>

              <ModalFooter>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EditAlumniDetails;
