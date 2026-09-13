import { api } from "@/apis";
import { GetSettingResponse, SetSettingRequest } from "./type";

export const GetSetting = async () => {
  const response = await api.get<GetSettingResponse>(
    "/api/members/me/settings",
  );

  return response.data;
};

export const setSetting = async ({ alarmEnabled }: SetSettingRequest) => {
  const response = await api.patch<GetSettingResponse>(
    "/api/members/me/settings",
    { darkMode: false, alarmEnabled },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};
