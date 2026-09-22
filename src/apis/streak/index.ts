import { api } from "@/apis";
import { GetStreakResponse } from "./type";

export const getStreak = async () => {
  const response = await api.get<GetStreakResponse>("/api/streak");

  return response.data;
};
