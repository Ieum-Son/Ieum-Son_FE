import { api } from "@/apis";
import { ChangeProfileProps, ChangeProfileResponse } from "./type";

const ChangeProfile = async ({ img }: ChangeProfileProps) => {
  const formData = new FormData();

  formData.append("image", {
    uri: img.uri,
    name: img.name,
    type: img.type,
  } as any);

  const response = await api.patch<ChangeProfileResponse>(
    "/api/members/me/profile",
    formData,
  );

  return response.data;
};

export default ChangeProfile;
