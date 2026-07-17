import { api } from "../..";
import type { signupProps, verifyCodeProps, verifyEmailProps } from "./type";

export const verifyEmail = async ({ email }: verifyEmailProps) => {
  const response = await api.post(`/api/auth/verify`, { email });
  return response;
};

export const verifyCode = async ({ email, code }: verifyCodeProps) => {
  const response = await api.post(`/api/auth/code`, { email, code });
  return response;
};

export const signup = async ({
  email,
  name,
  loginId,
  password,
}: signupProps) => {
  const response = await api.post(`/api/auth/signup`, {
    email,
    name,
    loginId,
    password,
  });
  return response;
};
