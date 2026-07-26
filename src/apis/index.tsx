import {
  getAccessTokens,
  getRefreshTokens,
  removeTokens,
  saveTokens,
} from "@/utils/tokenStorage";
import axios, {
  create,
  isAxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.");
}

export const api = create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const skipUrls = new Set([
  "/api/auth/login",
  "/api/auth/verify",
  "/api/auth/code",
  "/api/auth/signup",
  "/api/auth/refresh",
]);

const isSkipUrl = (url?: string) => {
  const pathname = url?.split("?")[0];
  return !!pathname && skipUrls.has(pathname);
};

let currentRefreshPromise: Promise<string> | null = null;
let refreshFailurePromise: Promise<void> | null = null;

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.request.use(async (config) => {
  if (isSkipUrl(config.url)) return config;

  const accessToken = await getAccessTokens();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config) {
      return Promise.reject(error);
    }

    if (isSkipUrl(config.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !config._retry) {
      const refreshToken = await getRefreshTokens();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      config._retry = true;

      try {
        if (!currentRefreshPromise) {
          currentRefreshPromise = axios
            .post<RefreshResponse>(
              `${BASE_URL}/api/auth/refresh`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" } },
            )
            .then(async ({ data }) => {
              await saveTokens(data);
              return data.accessToken;
            })
            .finally(() => {
              currentRefreshPromise = null;
            });
        }

        const newAccessToken = await currentRefreshPromise;

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(config);
      } catch (refreshError: unknown) {
        if (!refreshFailurePromise) {
          refreshFailurePromise = (async () => {
            const status = isAxiosError(refreshError)
              ? refreshError.response?.status
              : undefined;

            if (status === 401) {
              Alert.alert("세션 만료", "다시 로그인해 주세요.");
            } else if (status === 404) {
              Alert.alert("로그인 정보 없음", "다시 로그인해 주세요.");
            } else {
              Alert.alert(
                "인증 갱신 실패",
                "인증 갱신에 실패했습니다. 다시 로그인해 주세요.",
              );
            }

            await removeTokens();
            router.replace("/Login");
          })().finally(() => {
            refreshFailurePromise = null;
          });
        }

        await refreshFailurePromise;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
