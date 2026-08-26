import ChangeProfile from "@/apis/changeProfile";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ErrorResponse } from "./errorResponse";

export const useChangeProfile = () => {
  return useMutation({
    mutationFn: ChangeProfile,

    onSuccess: () => {
      console.log("프로필 사진 변경 완료!");
    },

    onError: (error: unknown) => {
      if (!isAxiosError<ErrorResponse>(error)) {
        console.error("알 수 없는 오류가 발생했습니다.");
        return;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        if (message === "프로필 이미지를 업로드해주세요.") {
          console.error("프로필 이미지를 업로드해주세요.");
        }
        if (message === "지원하지 않는 이미지 형식입니다.") {
          console.error("지원하지 않는 이미지 형식입니다.");
        }
        if (message === "파일 크기는 50MB 이하여야 합니다.") {
          console.error("파일 크기는 50MB 이하여야 합니다.");
        }
      } else if (status === 502) {
        console.error("프로필 이미지 업로드에 실패했습니다.");
      } else if (status === 401) {
        console.error("유효하지 않은 토큰입니다.");
      }
    },
  });
};
