import { getDailyProgress } from "@/apis/progress";
import type { DailyProgressResponse } from "@/apis/progress/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const DAILY_PROGRESS_QUERY_KEY = ["dailyProgress"];

export const getDailyProgressErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "오늘의 학습을 불러오는 데 실패했습니다.",
});

export const useDailyProgress = () =>
  useQuery<DailyProgressResponse, Error>({
    queryKey: DAILY_PROGRESS_QUERY_KEY,
    queryFn: getDailyProgress,
  });
