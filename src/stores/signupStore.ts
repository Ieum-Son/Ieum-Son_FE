import type {
  ProfileImage,
  SignupFormProps,
  SignupProps,
} from "@/apis/auth/signup/type";
import { create } from "zustand";

interface SignupState extends SignupFormProps {
  loginIdError: string | null;
  profile: ProfileImage | null;

  setEmail: (email: string) => void;
  setLoginId: (loginId: string) => void;
  setLoginIdError: (message: string | null) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setProfile: (profile: ProfileImage | null) => void;

  getSignupPayload: () => SignupProps | null;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set, get) => ({
  email: "",
  loginId: "",
  password: "",
  name: "",
  loginIdError: null,
  profile: null,

  setEmail: (email) => set({ email }),
  setLoginId: (loginId) => set({ loginId, loginIdError: null }),
  setLoginIdError: (loginIdError) => set({ loginIdError }),
  setPassword: (password) => set({ password }),
  setName: (name) => set({ name }),
  setProfile: (profile) => set({ profile }),

  getSignupPayload: () => {
    const { email, loginId, password, name, profile } = get();

    if (!profile) {
      return null;
    }

    return { email, loginId, password, name, image: profile };
  },

  reset: () =>
    set({
      email: "",
      loginId: "",
      password: "",
      name: "",
      loginIdError: null,
      profile: null,
    }),
}));
