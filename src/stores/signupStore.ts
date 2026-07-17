import type { SignupProps } from "@/apis/auth/signup/type";
import { create } from "zustand";

interface SignupState extends SignupProps {
  loginIdError: string | null;

  setEmail: (email: string) => void;
  setLoginId: (loginId: string) => void;
  setLoginIdError: (message: string | null) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;

  getSignupPayload: () => SignupProps;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set, get) => ({
  email: "",
  loginId: "",
  password: "",
  name: "",
  loginIdError: null,

  setEmail: (email) => set({ email }),
  setLoginId: (loginId) => set({ loginId, loginIdError: null }),
  setLoginIdError: (loginIdError) => set({ loginIdError }),
  setPassword: (password) => set({ password }),
  setName: (name) => set({ name }),

  getSignupPayload: () => {
    const { email, loginId, password, name } = get();
    return { email, loginId, password, name };
  },

  reset: () =>
    set({
      email: "",
      loginId: "",
      password: "",
      name: "",
      loginIdError: null,
    }),
}));
