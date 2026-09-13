export interface GetSettingResponse {
  darkMode: boolean;
  alarmEnabled: boolean;
}

export interface SetSettingRequest {
  alarmEnabled: boolean;
}
