import { api } from "@/apis";
import { RankingResponse } from "./type";

export const Ranking = async () => {
  const response = await api.get<RankingResponse>("/api/ranking");

  return response.data;
};
