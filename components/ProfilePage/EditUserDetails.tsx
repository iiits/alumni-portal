"use client";

import React, { useState } from "react";
import { Modal, ModalBody,useModal, ModalContent, ModalFooter, ModalTrigger } from "../ui/animated-modal";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditUserDetailsProps {
  userData: {
    id: string;
    name: string;
    personalEmail: string;
    username: string;
    profiles: { type: 'youtube' | 'reddit' | 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'discord' | 'github'; link: string; visibility: boolean }[];
    bio?: string;
  };
}

const EditUserDetails: React.FC<EditUserDetailsProps> = ({ userData }) => {
  const router = useRouter();
  const { open, setOpen } = useModal();
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true); // Set loading state before request
      const formattedData = {
        ...data,
        profiles: data.profiles.map((profile: any) => ({
          ...profile,
          visibility: profile.visibility ? "yes" : "no",
        })),
      };
      return axiosInstance.put(`/user/${userData.id}`, formattedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsLoading(false); 
      setOpen(false); 
      setTimeout(() => {
        router.refresh();
      }, 200);
     
    },
    onError: (error) => {
      toast.error("Error updating profile: " + error.message);
      setIsLoading(false); // Remove loading state in case of error
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (index: number, key: string, value: string | boolean) => {
    const updatedProfiles = [...formData.profiles];
    updatedProfiles[index] = { ...updatedProfiles[index], [key]: value };
    setFormData({ ...formData, profiles: updatedProfiles });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div>
      <Modal>
        <ModalTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {isLoading ? "Updating..." : "Edit Details"} {/* Show loading state on button */}
        </ModalTrigger>
        <ModalBody className="max-h-[80vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <ModalContent>
            <h2 className="text-xl font-bold mb-4">Edit User Details</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block font-semibold">Personal Email</label>
                <input name="personalEmail" value={formData.personalEmail} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block font-semibold">Username</label>
                <input name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block font-semibold">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <h3 className="font-semibold">Social Profiles</h3>
                {formData.profiles.map((profile, index) => (
                  <div key={index} className="mt-2 p-4 bg-gray-100 rounded-md">
                    <label className="block font-semibold">Platform</label>
                    <select
                      value={profile.type}
                      onChange={(e) => handleProfileChange(index, "type", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="reddit">Reddit</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="discord">Discord</option>
                      <option value="github">GitHub</option>
                    </select>
                    <label className="block font-semibold mt-2">Link</label>
                    <input
                      value={profile.link}
                      onChange={(e) => handleProfileChange(index, "link", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={profile.visibility}
                        onChange={(e) => handleProfileChange(index, "visibility", e.target.checked)}
                      />
                      <span className="ml-2">Visible</span>
                    </label>
                  </div>
                ))}
              </div>
              <ModalFooter>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                  disabled={isLoading} // Disable button while loading
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

export default EditUserDetails;
