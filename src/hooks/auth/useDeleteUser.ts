import { deleteUser } from "@/apis/auth/deleteUser";
import { useSignupStore } from "@/stores/signupStore";
import { useUserStore } from "@/stores/userStore";
import { removeTokens } from "@/utils/tokenStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import type { ErrorResponse } from "./errorResponse";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      try {
        await removeTokens();
      } catch (error) {
        console.error("회원탈퇴 후 토큰 삭제 실패:", error);
      } finally {
        useUserStore.getState().clearUser();
        useSignupStore.getState().reset();
        queryClient.clear();
        router.replace("/Splash");
      }
    },
    onError: (error: unknown) => {
      const status = isAxiosError<ErrorResponse>(error)
        ? error.response?.status
        : undefined;
      const message = isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;

      const title =
        status === 401
          ? "인증 오류"
          : status === 404
            ? "회원 정보 없음"
            : "회원탈퇴 실패";

      Alert.alert(
        title,
        message ?? "회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    },
  });
};
