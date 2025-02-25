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
                <div key={index} className="p-4 bg-gray-100 rounded-md">
                  <label className="block font-semibold">Title</label>
                  <input
                    value={job.title}
                    onChange={(e) =>
                      handleArrayChange(
                        "jobPosition",
                        index,
                        "title",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <label className="block font-semibold mt-2">Company</label>
                  <input
                    value={job.location}
                    onChange={(e) =>
                      handleArrayChange(
                        "jobPosition",
                        index,
                        "location",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}

              {/* Education */}
              <h3 className="font-semibold">Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-md">
                  <label className="block font-semibold">School</label>
                  <input
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayChange(
                        "education",
                        index,
                        "school",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <label className="block font-semibold mt-2">Degree</label>
                  <input
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayChange(
                        "education",
                        index,
                        "degree",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}

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
