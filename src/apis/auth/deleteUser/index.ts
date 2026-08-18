import { api } from "@/apis";
import type { DeleteUserRequest } from "./type";

export const deleteUser = async ({ password }: DeleteUserRequest) => {
  const response = await api.delete<void>("/api/auth/account", {
    data: { password },
  });

  return response.data;
};
