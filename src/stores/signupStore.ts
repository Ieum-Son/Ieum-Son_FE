import { create } from "zustand";

interface SignupState {
  email: string;
  id: string;
  password: string;
  name: string;

  setEmail: (email: string) => void;
  setId: (id: string) => void;
  setPassword: (password: string) => void;
  setName: (nickname: string) => void;

  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: "",
  id: "",
  password: "",
  name: "",

  setEmail: (email) => set({ email }),
  setId: (id) => set({ id }),
  setPassword: (password) => set({ password }),
  setName: (name) => set({ name }),

  reset: () =>
    set({
      email: "",
      id: "",
      password: "",
      name: "",
    }),
}));
