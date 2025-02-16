import { create } from 'zustand';

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
  profilePicture: string;
  batch: number;
  department: string;
  profiles: Profile[];
  bio: string;
  role: string;
  alumniDetails: any | null;
}

interface UserState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setUser: (token: string, user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  
  setUser: (token, user) => {
    set({
      token,
      user,
      isLoggedIn: true,
    });
  },
  
  logout: () => {
    set({
      token: null,
      user: null,
      isLoggedIn: false,
    });
  },
}));
