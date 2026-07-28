import { create } from "zustand";

export interface UserProfile {
  email: string;
  name: string;
  loginId: string;
  profileImageUrl: string | null;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
