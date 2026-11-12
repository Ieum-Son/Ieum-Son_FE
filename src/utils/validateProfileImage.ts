import type { ProfileImage } from "@/apis/auth/signup/type";
import {
  MAX_PROFILE_IMAGE_SIZE,
  SUPPORTED_IMAGE_MIME_TYPES,
} from "@/constants/profileImage";

export const validateProfileImage = (image: ProfileImage) => {
  if (!SUPPORTED_IMAGE_MIME_TYPES.has(image.type)) {
    return "지원하지 않는 이미지 형식입니다.";
  }

  if (image.size !== undefined && image.size > MAX_PROFILE_IMAGE_SIZE) {
    return "파일 크기는 50MB 이하이어야 합니다.";
  }

  return null;
};
