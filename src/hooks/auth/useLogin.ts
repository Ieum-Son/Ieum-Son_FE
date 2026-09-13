import { login } from "@/apis/auth/login/index";
import type { LoginRequestProps } from "@/apis/auth/login/type";
import { queryClient } from "@/libs/queryClient";
import { useUserStore } from "@/stores/userStore";
import { saveTokens } from "@/utils/tokenStorage";
import { useMutation } from "@tanstack/react-query";
import {
  createErrorMessage,
  TOO_MANY_REQUESTS_MESSAGE,
} from "../errorResponse";
import { USER_INFO_QUERY_KEY } from "../UserInfo";

export const getLoginErrorMessage = createErrorMessage({
  status: {
    400: "로그인에 실패했습니다.",
    403: "이메일 코드 인증이 필요합니다.",
    429: TOO_MANY_REQUESTS_MESSAGE,
  },
  preferServerMessage: true,
  unknownMessage: "로그인 정보를 저장하는 중 오류가 발생했습니다.",
  fallback: "로그인 중 오류가 발생했습니다.",
});

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequestProps) => {
      const tokens = await login(credentials);
      await saveTokens(tokens);
      return tokens;
    },

    onSuccess: () => {
      useUserStore.getState().clearUser();
      queryClient.removeQueries({ queryKey: USER_INFO_QUERY_KEY });

      console.log("로그인 성공!");
      //메인 페이지로 이동 router.push
    },

    onError: (error: unknown) => console.error(getLoginErrorMessage(error)),
  });
};
