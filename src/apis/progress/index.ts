import { api } from "@/apis";
import type { DailyProgressResponse } from "./type";

export const getDailyProgress = async () => {
  const response = await api.get<DailyProgressResponse>("/api/progress/daily");

  return response.data;
};
