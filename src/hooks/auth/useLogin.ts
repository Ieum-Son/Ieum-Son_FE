import { login } from "@/apis/auth/login/index";
import type { LoginRequestProps } from "@/apis/auth/login/type";
import { useUserStore } from "@/stores/userStore";
import { saveTokens } from "@/utils/tokenStorage";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { ErrorResponse } from "../errorResponse";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequestProps) => {
      const tokens = await login(credentials);
      await saveTokens(tokens);
      return tokens;
    },

    onSuccess: (_tokens, credentials) => {
      const currentUser = useUserStore.getState().user;

      if (currentUser?.loginId !== credentials.loginId) {
        useUserStore.getState().setUser({
          email: "",
          name: credentials.loginId,
          loginId: credentials.loginId,
          profileImageUrl: null,
        });
      }

      console.log("로그인 성공!");
      //메인 페이지로 이동 router.push
    },

    onError: (error: unknown) => {
      if (!isAxiosError<ErrorResponse>(error)) {
        console.error("로그인 정보를 저장하는 중 오류가 발생했습니다.");
        return;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        console.error(message ?? "로그인에 실패했습니다.");
      } else if (status === 403) {
        console.error(message ?? "이메일 코드 인증이 필요합니다.");
      } else if (status === 429) {
        console.error(
          message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        );
      } else {
        console.error(message ?? "로그인 중 오류가 발생했습니다.");
      }
    },
  });
};
