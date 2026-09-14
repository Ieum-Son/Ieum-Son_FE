import DefaultProfile from "@/assets/user/defaultProfile.png";
import type { ImageSourcePropType } from "react-native";

export const getProfileSource = (
  profileImageUrl?: string | null,
): ImageSourcePropType =>
  profileImageUrl ? { uri: profileImageUrl } : DefaultProfile;
