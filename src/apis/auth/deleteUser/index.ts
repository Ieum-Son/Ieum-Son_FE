import { api } from "@/apis";
import type { LoginRequestProps } from "./type";

export const login = async ({ password }: LoginRequestProps) => {
  const response = await api.post(`/api/auth/account`, {
    password,
  });
  return response.data;
};
