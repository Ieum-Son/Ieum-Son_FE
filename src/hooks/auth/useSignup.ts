import { signup, verifyCode, verifyEmail } from "@/apis/auth/signup";
import { useSignupStore } from "@/stores/signupStore";
import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import type { ErrorResponse } from "./errorResponse";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,

    onSuccess: () => {
      console.log("이메일 발송 성공!");
    },

    onError: (error: unknown) => {
      if (!isAxiosError<ErrorResponse>(error)) {
        console.error("알 수 없는 오류가 발생했습니다.");
        return;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        console.error(message ?? "이메일 형식이 올바르지 않습니다.");
      } else if (status === 409) {
        console.error(message ?? "이미 존재하는 이메일입니다.");
      } else if (status === 429) {
        console.error(
          message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        );
      } else if (status === 502) {
        console.error(message ?? "인증 메일 전송에 실패했습니다.");
      } else {
        console.error(message ?? "이메일 인증 요청 중 오류가 발생했습니다.");
      }
    },
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: verifyCode,

    onSuccess: () => {
      console.log("인증 성공");
    },

    onError: (error: unknown) => {
      if (!isAxiosError<ErrorResponse>(error)) {
        console.error("알 수 없는 오류가 발생했습니다.");
        return;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        console.error(message ?? "인증 코드가 올바르지 않거나 만료되었습니다.");
      } else if (status === 429) {
        console.error(
          message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        );
      } else {
        console.error(message ?? "인증 코드 확인 중 오류가 발생했습니다.");
      }
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,

    onSuccess: (data, signupPayload) => {
      useUserStore.getState().setUser({
        email: signupPayload.email,
        name: signupPayload.name,
        loginId: signupPayload.loginId,
        profileImageUrl: data.profileImageUrl,
      });
      useSignupStore.getState().reset();
      console.log("회원가입 성공!");
      router.push("/Login");
    },

    onError: (error: unknown) => {
      if (!isAxiosError<ErrorResponse>(error)) {
        console.error("알 수 없는 오류가 발생했습니다.");
        return;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        console.error(message ?? "프로필 이미지를 확인해주세요.");
      } else if (status === 403) {
        console.error(message ?? "이메일 코드 인증이 필요합니다.");
      } else if (status === 409) {
        if (message?.includes("로그인 ID")) {
          useSignupStore
            .getState()
            .setLoginIdError(message ?? "이미 사용 중인 로그인 ID입니다.");
          router.dismissTo("/Signup/IdSetting");
        }
        console.error(message ?? "이미 사용 중인 이메일 또는 로그인 ID입니다.");
      } else if (status === 429) {
        console.error(
          message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        );
      } else if (status === 502) {
        console.error(message ?? "프로필 이미지 업로드에 실패했습니다.");
      } else {
        console.error(message ?? "회원가입 중 오류가 발생했습니다.");
      }
    },
  });
};
