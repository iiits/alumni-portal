"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Profile {
  type: string;
  link: string;
  visibility: string;
  _id: string;
}

interface User {
  id: string;
  name: string;
  collegeEmail: string;
  personalEmail: string;
  userId: string;
  username: string;
  profilePicture: string | null;
  batch: number;
  department: string;
  profiles: Profile[];
  bio: string | null;
  role: "student" | "alumni" | "admin";
  alumniDetails?: {
    company?: string;
    position?: string;
    location?: string;
  } | null;
}

interface UserState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setUser: (token: string, user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      setUser: (token, user) => {
        set({ token, user, isLoggedIn: true });
      },

      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
