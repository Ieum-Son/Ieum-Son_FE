import { logoutUser } from "@/apis/auth/logout";
import { useSignupStore } from "@/stores/signupStore";
import { useUserStore } from "@/stores/userStore";
import { getAccessTokens, removeTokens } from "@/utils/tokenStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { createErrorMessage } from "../errorResponse";

export const getLogoutErrorMessage = createErrorMessage({
  preferServerMessage: true,
  unknownMessage: "로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.",
  fallback: "로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.",
});

export const useLogout = () => {
  const queryClient = useQueryClient();

  const removeTokensSafely = async () => {
    try {
      await removeTokens();
    } catch (firstError) {
      console.error("로그아웃 토큰 삭제 재시도:", firstError);

      try {
        await removeTokens();
      } catch (finalError) {
        console.error("로그아웃 토큰 삭제 실패:", finalError);
      }
    }
  };

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: async () => {
      try {
        await removeTokensSafely();
      } finally {
        useUserStore.getState().clearUser();
        useSignupStore.getState().reset();
        queryClient.clear();
        router.replace("/Splash");
      }
    },

    onError: async (error: unknown) => {
      if (!(await getAccessTokens())) return;

      Alert.alert("로그아웃 실패", getLogoutErrorMessage(error), [
        { text: "확인" },
      ]);
    },
  });
};
