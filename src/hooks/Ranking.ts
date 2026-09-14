import { Ranking } from "@/apis/ranking";
import type { RankingResponse } from "@/apis/ranking/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "./errorResponse";

export const RANKING_QUERY_KEY = ["ranking"];

export const getRankingErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "랭킹 정보를 찾을 수 없습니다.",
  },
  fallback: "랭킹을 불러오는 데 실패했습니다.",
});

export const useRanking = () =>
  useQuery<RankingResponse, Error>({
    queryKey: RANKING_QUERY_KEY,
    queryFn: Ranking,
  });
