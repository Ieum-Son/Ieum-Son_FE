import { api } from "@/apis";
import { ChangeNameProps, ChangeNameResponse } from "./type";

export const ChangeName = async ({ name }: ChangeNameProps) => {
  const response = await api.patch<ChangeNameResponse>(
    "/api/members/me/rename",
    { name },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};
