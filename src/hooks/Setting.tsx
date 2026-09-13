import { GetSetting, setSetting } from "@/apis/setting";
import type { GetSettingResponse } from "@/apis/setting/type";
import { queryClient } from "@/libs/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "./errorResponse";

export const SETTING_QUERY_KEY = ["setting"];

export const getSettingErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  fallback: "설정 정보를 불러오는 데 실패했습니다.",
});

export const getUpdateSettingErrorMessage = createErrorMessage({
  status: {
    400: "설정 값을 다시 확인해주세요.",
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: [400],
  fallback: "설정 변경에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useSetting = () =>
  useQuery<GetSettingResponse, Error>({
    queryKey: SETTING_QUERY_KEY,
    queryFn: GetSetting,
  });

export const useUpdateSetting = () => {
  return useMutation({
    mutationFn: setSetting,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: SETTING_QUERY_KEY });
      const previous =
        queryClient.getQueryData<GetSettingResponse>(SETTING_QUERY_KEY);

      queryClient.setQueryData<GetSettingResponse>(
        SETTING_QUERY_KEY,
        (cached) =>
          cached ? { ...cached, alarmEnabled: variables.alarmEnabled } : cached,
      );

      return { previous };
    },
    onSuccess: (data) => queryClient.setQueryData(SETTING_QUERY_KEY, data),
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTING_QUERY_KEY, context.previous);
      }
      queryClient.invalidateQueries({ queryKey: SETTING_QUERY_KEY });
      console.error(getUpdateSettingErrorMessage(error));
    },
  });
};
