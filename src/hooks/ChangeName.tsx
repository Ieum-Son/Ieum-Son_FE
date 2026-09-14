import { ChangeName } from "@/apis/changeName";
import type { UserInfoResponse } from "@/apis/userInfo/type";
import { queryClient } from "@/libs/queryClient";
import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { createErrorMessage } from "./errorResponse";
import { USER_INFO_QUERY_KEY } from "./UserInfo";

export const getChangeNameErrorMessage = createErrorMessage({
  status: {
    400: "입력한 이름을 다시 확인해주세요.",
    401: "유효하지 않은 토큰입니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: [400, 409],
  fallback: "이름 변경에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useChangeName = () => {
  return useMutation({
    mutationFn: ChangeName,
    onSuccess: (data) => {
      const changed = {
        name: data.name,
        gold: data.gold,
        profileImageUrl: data.profileImageUrl ?? null,
      };

      useUserStore.getState().updateUser(changed);
      queryClient.setQueryData<UserInfoResponse>(
        USER_INFO_QUERY_KEY,
        (cached) => (cached ? { ...cached, ...changed } : cached),
      );
      queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY });
    },
    onError: (error) => console.error(getChangeNameErrorMessage(error)),
  });
};
