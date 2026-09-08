import { create } from "zustand";

export interface UserProfile {
  name: string;
  gold: number;
  profileImageUrl: string | null;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (patch) =>
    set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
  clearUser: () => set({ user: null }),
}));
