import { getStreak } from "@/apis/streak";
import type { GetStreakResponse } from "@/apis/streak/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const STREAK_QUERY_KEY = ["streak"];

export const getStreakErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "스트릭 정보를 불러오는 데 실패했습니다.",
});

export const useStreak = () =>
  useQuery<GetStreakResponse, Error>({
    queryKey: STREAK_QUERY_KEY,
    queryFn: getStreak,
  });
