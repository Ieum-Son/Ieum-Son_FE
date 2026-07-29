import { api } from "@/apis";

export const logoutUser = async () => {
  await api.post<void>("/api/auth/logout", undefined, {
    headers: { "Content-Type": "application/json" },
  });
};
