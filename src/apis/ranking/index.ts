import { api } from "@/apis";
import { RankingParams, RankingResponse } from "./type";

export const Ranking = async ({ page, size }: RankingParams = {}) => {
  const response = await api.get<RankingResponse>("/api/ranking", {
    params: {
      ...(page === undefined ? {} : { page }),
      ...(size === undefined ? {} : { size }),
    },
  });

  return response.data;
};
