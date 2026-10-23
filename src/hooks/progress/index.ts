import { getDailyProgress, submitSentenceAnswer } from "@/apis/progress";
import type { DailyProgressResponse } from "@/apis/progress/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const getSubmitSentenceAnswerErrorMessage = createErrorMessage({
  status: {
    400: "오늘 학습에 배정되지 않은 문장입니다.",
    401: "인증이 필요합니다.",
    404: "해당 문장이 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "답안 제출에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useSubmitSentenceAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitSentenceAnswer,

    onSuccess: (data) => {
      if (!data.isCompleted) return;

      queryClient.invalidateQueries({ queryKey: DAILY_PROGRESS_QUERY_KEY });
    },

    onError: (error) =>
      console.error(getSubmitSentenceAnswerErrorMessage(error)),
  });
};
