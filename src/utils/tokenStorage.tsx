import type { LoginResponseProps } from "@/apis/auth/login/type";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const saveTokens = async ({
  accessToken,
  refreshToken,
}: LoginResponseProps) => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
    throw error;
  }
};

export const getAccessTokens = () => {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshTokens = () => {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const removeTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
};
