import { logoutUser } from "@/apis/auth/logout";
import { useSignupStore } from "@/stores/signupStore";
import { useUserStore } from "@/stores/userStore";
import { removeTokens } from "@/utils/tokenStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import type { ErrorResponse } from "./errorResponse";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: async () => {
      await removeTokens();
      useUserStore.getState().clearUser();
      useSignupStore.getState().reset();
      queryClient.clear();
      router.replace("/Splash");
    },

    onError: (error: unknown) => {
      const message = isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;

      Alert.alert(
        "로그아웃 실패",
        message ?? "로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.",
        [{ text: "확인" }],
      );
    },
  });
};
