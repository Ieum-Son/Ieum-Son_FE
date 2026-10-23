import {
  completeDailyProgress,
  getDailyProgress,
  submitSentenceAnswer,
  submitWordAttempt,
} from "@/apis/progress";
import type { DailyProgressResponse } from "@/apis/progress/type";
import type { UserInfoResponse } from "@/apis/userInfo/type";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CALENDAR_QUERY_KEY } from "../calendar";
import { createErrorMessage } from "../errorResponse";
import { GOLD_USE_HISTORY_QUERY_KEY } from "../goldUseHistory";
import { STREAK_QUERY_KEY } from "../streak";
import { STUDY_CHAPTERS_QUERY_KEY } from "../Study";
import { USER_INFO_QUERY_KEY } from "../UserInfo";

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

export const getCompleteDailyProgressErrorMessage = createErrorMessage({
  status: {
    400: "오늘의 학습을 모두 완료해야 합니다.",
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "학습 완료 처리에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useCompleteDailyProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDailyProgress,

    onSuccess: (data) => {
      useUserStore.getState().updateUser({ gold: data.goldBalance });
      queryClient.setQueryData<UserInfoResponse>(
        USER_INFO_QUERY_KEY,
        (cached) =>
          cached
            ? {
                ...cached,
                gold: data.goldBalance,
                streakCount: data.streakCount,
              }
            : cached,
      );

      queryClient.invalidateQueries({ queryKey: DAILY_PROGRESS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STREAK_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GOLD_USE_HISTORY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STUDY_CHAPTERS_QUERY_KEY });
    },

    onError: (error) =>
      console.error(getCompleteDailyProgressErrorMessage(error)),
  });
};

export const getSubmitWordAttemptErrorMessage = createErrorMessage({
  status: {
    400: "오늘 학습에 배정되지 않은 단어입니다.",
    401: "인증이 필요합니다.",
    404: "해당 단어가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "학습 기록 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useSubmitWordAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitWordAttempt,

    onSuccess: (data) => {
      if (!data.passed) return;

      queryClient.invalidateQueries({ queryKey: DAILY_PROGRESS_QUERY_KEY });
    },

    onError: (error) => console.error(getSubmitWordAttemptErrorMessage(error)),
  });
};
