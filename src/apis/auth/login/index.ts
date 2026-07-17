import { api } from "@/apis";
import { Loginprops } from "./type";

export const login = async ({ loginId, password }: Loginprops) => {
  const response = await api.post(`/api/auth/login`, {
    loginId,
    password,
  });
  return response;
};
