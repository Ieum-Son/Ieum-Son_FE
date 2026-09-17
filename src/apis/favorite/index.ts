import { api } from "..";
import {
  AddFavoriteProps,
  DeleteFavoriteProps,
  GetFavoriteResponse,
} from "./type";

export const getFavorite = async () => {
  const response = await api.get<GetFavoriteResponse>(`/api/favorites`);

  return response.data;
};

export const addFavorite = async ({ wordId }: AddFavoriteProps) => {
  const response = await api.post(`/api/favorites/${wordId}`);

  return response.data;
};

export const deleteFavorite = async ({ wordId }: DeleteFavoriteProps) => {
  const response = await api.delete(`/api/favorites/${wordId}`);

  return response.data;
};
