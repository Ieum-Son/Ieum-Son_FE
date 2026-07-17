import { signup, verifyCode, verifyEmail } from "@/apis/auth/signup";
import { useMutation } from "@tanstack/react-query";

interface ErrorResponse {
  code?: number;
  message?: string;
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,

    onSuccess: () => {
      console.log("이메일 발송 성공!");
    },

    onError: (error: ErrorResponse) => {
      if (error.code === 404) {
        console.error("이메일 형식이 올바르지 않습니다.");
      } else if (error.code === 429) {
        console.error("인증 메일은 잠시 후 다시 요청해주세요.");
      } else {
        console.error("에러가 발생했습니다");
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

    onError: (error: ErrorResponse) => {
      if (error.code === 400) {
        console.error("인증이 필요합니다.");
      } else {
        console.error("에러가 발생했습니다");
      }
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      console.log("회원가입 성공!");
    },

    onError: (error: ErrorResponse) => {
      if (error.code === 400) {
        console.error("이메일 또는 비밀번호가 올바르지 않습니다");
      } else if (error.code === 404) {
        console.error("등록되지 않은 회원입니다.");
      }
    },
  });
};
