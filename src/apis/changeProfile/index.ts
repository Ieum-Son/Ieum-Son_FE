import { api } from "@/apis";
import { ChangeProfileProps, ChangeProfileResponse } from "./type";

const ChangeProfile = async ({ img }: ChangeProfileProps) => {
  if (!img?.uri) throw new Error("업로드할 이미지가 없습니다.");

  const formData = new FormData();

  formData.append("image", {
    uri: img.uri,
    name: img.name,
    type: img.type,
  } as unknown as Blob);

  const response = await api.patch<ChangeProfileResponse>(
    "/api/members/me/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data;
};

export default ChangeProfile;
