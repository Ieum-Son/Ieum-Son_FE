import { api } from "@/apis";
import { ChangeProfileProps, ChangeProfileResponse } from "./type";

const ChangeProfile = async ({ name, img }: ChangeProfileProps) => {
  if (!name && !img?.uri) throw new Error("변경할 내용이 없습니다.");

  const formData = new FormData();

  if (name) formData.append("name", name);

  if (img?.uri) {
    formData.append("image", {
      uri: img.uri,
      name: img.name,
      type: img.type,
    } as unknown as Blob);
  }

  const response = await api.patch<ChangeProfileResponse>(
    "/api/members/me/profile",
    formData,
  );

  return response.data;
};

export default ChangeProfile;
