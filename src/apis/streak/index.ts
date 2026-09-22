import { api } from "@/apis";
import { GetStreakResponse, RecoverStreakResponse } from "./type";

export const getStreak = async () => {
  const response = await api.get<GetStreakResponse>("/api/streak");

  return response.data;
};

export const recoverStreak = async () => {
  const response = await api.post<RecoverStreakResponse>("/api/streak/recover");

  return response.data;
};
