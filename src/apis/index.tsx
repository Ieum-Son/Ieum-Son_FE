import { create } from "axios";

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
