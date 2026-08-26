import { api } from "@/apis";
import { ChangeProfileProps, ChangeProfileResponse } from "./type";

const ChangeProfile = async ({ img }: ChangeProfileProps) => {
  const formData = new FormData();

  formData.append("image", img);

  const response = await api.patch<ChangeProfileResponse>(
    "/api/members/me/profile",
    formData,
  );

  return response.data;
};

export default ChangeProfile;
