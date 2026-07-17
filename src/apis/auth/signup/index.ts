import { api } from "@/apis";
import type { SignupProps, VerifyCodeProps, VerifyEmailProps } from "./type";

export const verifyEmail = async ({ email }: VerifyEmailProps): Promise<void> => {
  await api.post(`/api/auth/verify`, { email });
};

export const verifyCode = async ({
  email,
  code,
}: VerifyCodeProps): Promise<void> => {
  await api.post(`/api/auth/code`, { email, code });
};

export const signup = async ({
  email,
  name,
  loginId,
  password,
}: SignupProps): Promise<void> => {
  await api.post(`/api/auth/signup`, {
    email,
    name,
    loginId,
    password,
  });
};
