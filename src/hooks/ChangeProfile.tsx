import ChangeProfile from "@/apis/changeProfile";
import type { UserInfoResponse } from "@/apis/userInfo/type";
import { queryClient } from "@/libs/queryClient";
import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { createErrorMessage } from "./errorResponse";
import { USER_INFO_QUERY_KEY } from "./UserInfo";

export const getChangeProfileErrorMessage = createErrorMessage({
  status: {
    400: "입력한 내용을 다시 확인해주세요.",
    401: "유효하지 않은 토큰입니다.",
    404: "해당 유저가 존재하지 않습니다.",
    502: "프로필 이미지 업로드에 실패했습니다.",
  },
  preferServerMessage: [400],
  fallback: "프로필 변경에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useChangeProfile = () => {
  return useMutation({
    mutationFn: ChangeProfile,
    onSuccess: (data, variables) => {
      const changed = {
        ...(variables.name ? { name: variables.name } : {}),
        profileImageUrl: data.profileImageUrl,
      };

      useUserStore.getState().updateUser(changed);
      queryClient.setQueryData<UserInfoResponse>(
        USER_INFO_QUERY_KEY,
        (cached) => (cached ? { ...cached, ...changed } : cached),
      );
      queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY });
    },
    onError: (error) => console.error(getChangeProfileErrorMessage(error)),
  });
};
