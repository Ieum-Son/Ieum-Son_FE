import axios from "axios";

const BaseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BaseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
