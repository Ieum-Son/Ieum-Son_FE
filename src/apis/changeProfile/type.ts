import type { ProfileImage } from "@/apis/auth/signup/type";

export interface ChangeProfileResponse {
  profileImageUrl: string;
}

export interface ChangeProfileProps {
  img: ProfileImage;
}
