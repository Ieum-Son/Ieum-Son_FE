import { api } from "@/apis";
import {
  AddFavoriteProps,
  DeleteFavoriteProps,
  GetFavoriteResponse,
} from "./type";

export const getFavorite = async () => {
  const response = await api.get<GetFavoriteResponse>("/api/favorites");

  return response.data;
};

export const addFavorite = async ({ wordId }: AddFavoriteProps) => {
  const response = await api.post<void>(`/api/favorites/${wordId}`);

  return response.data;
};

export const deleteFavorite = async ({ wordId }: DeleteFavoriteProps) => {
  const response = await api.delete<void>(`/api/favorites/${wordId}`);

  return response.data;
};
