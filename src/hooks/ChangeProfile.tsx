import ChangeProfile from "@/apis/changeProfile";
import { queryClient } from "@/libs/queryClient";
import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ErrorResponse } from "./errorResponse";

export const getChangeProfileErrorMessage = (error: unknown) => {
  if (!isAxiosError<ErrorResponse>(error)) {
    return error instanceof Error
      ? error.message
      : "알 수 없는 오류가 발생했습니다.";
  }
  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (status === 400) return message ?? "이미지를 다시 확인해주세요.";
  if (status === 401) return "유효하지 않은 토큰입니다.";
  if (status === 404) return "해당 유저가 존재하지 않습니다.";
  if (status === 502) return "프로필 이미지 업로드에 실패했습니다.";
  return "프로필 사진 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
};

export const useChangeProfile = () => {
  return useMutation({
    mutationFn: ChangeProfile,
    onSuccess: (data) => {
      const user = useUserStore.getState().user;
      if (user) {
        useUserStore.getState().setUser({
          ...user,
          profileImageUrl: data.profileImageUrl,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => console.error(getChangeProfileErrorMessage(error)),
  });
};
