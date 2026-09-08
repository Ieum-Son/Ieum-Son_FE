import { api } from "@/apis";
import { UserInfoResponse } from "./type";

const UserInfo = async () => {
  const response = await api.get<UserInfoResponse>("/api/members/me/profile");

  return response.data;
};

export default UserInfo;
