import { getStreak, recoverStreak } from "@/apis/streak";
import type { GetStreakResponse } from "@/apis/streak/type";
import type { UserInfoResponse } from "@/apis/userInfo/type";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CALENDAR_QUERY_KEY } from "../calendar";
import { GOLD_USE_HISTORY_QUERY_KEY } from "../goldUseHistory";
import { createErrorMessage } from "../errorResponse";
import { USER_INFO_QUERY_KEY } from "../UserInfo";

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

export const getRecoverStreakErrorMessage = createErrorMessage({
  status: {
    400: "스트릭을 회복할 수 없습니다.",
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "스트릭 회복에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useRecoverStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recoverStreak,

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

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: STREAK_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: GOLD_USE_HISTORY_QUERY_KEY,
        }),
      ]);
    },

    onError: (error) => console.error(getRecoverStreakErrorMessage(error)),
  });
};
