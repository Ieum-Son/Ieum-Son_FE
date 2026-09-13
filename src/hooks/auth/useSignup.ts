import { signup, verifyCode, verifyEmail } from "@/apis/auth/signup";
import { useSignupStore } from "@/stores/signupStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  createErrorMessage,
  getErrorStatus,
  getServerErrorMessage,
  TOO_MANY_REQUESTS_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from "../errorResponse";

export const getVerifyEmailErrorMessage = createErrorMessage({
  status: {
    400: "이메일 형식이 올바르지 않습니다.",
    409: "이미 존재하는 이메일입니다.",
    429: TOO_MANY_REQUESTS_MESSAGE,
    502: "인증 메일 전송에 실패했습니다.",
  },
  preferServerMessage: true,
  unknownMessage: UNKNOWN_ERROR_MESSAGE,
  fallback: "이메일 인증 요청 중 오류가 발생했습니다.",
});

export const getVerifyCodeErrorMessage = createErrorMessage({
  status: {
    400: "인증 코드가 올바르지 않거나 만료되었습니다.",
    429: TOO_MANY_REQUESTS_MESSAGE,
  },
  preferServerMessage: true,
  unknownMessage: UNKNOWN_ERROR_MESSAGE,
  fallback: "인증 코드 확인 중 오류가 발생했습니다.",
});

export const getSignupErrorMessage = createErrorMessage({
  status: {
    400: "프로필 이미지를 확인해주세요.",
    403: "이메일 코드 인증이 필요합니다.",
    409: "이미 사용 중인 이메일 또는 로그인 ID입니다.",
    429: TOO_MANY_REQUESTS_MESSAGE,
    502: "프로필 이미지 업로드에 실패했습니다.",
  },
  preferServerMessage: true,
  unknownMessage: UNKNOWN_ERROR_MESSAGE,
  fallback: "회원가입 중 오류가 발생했습니다.",
});

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,

    onSuccess: () => {
      console.log("이메일 발송 성공!");
    },

    onError: (error: unknown) =>
      console.error(getVerifyEmailErrorMessage(error)),
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: verifyCode,

    onSuccess: () => {
      console.log("인증 성공");
    },

    onError: (error: unknown) =>
      console.error(getVerifyCodeErrorMessage(error)),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      useSignupStore.getState().reset();
      console.log("회원가입 성공!");
      router.push("/Login");
    },

    onError: (error: unknown) => {
      const serverMessage = getServerErrorMessage(error);

      if (
        getErrorStatus(error) === 409 &&
        serverMessage?.includes("로그인 ID")
      ) {
        useSignupStore.getState().setLoginIdError(serverMessage);
        router.dismissTo("/Signup/IdSetting");
      }

      console.error(getSignupErrorMessage(error));
    },
  });
};
