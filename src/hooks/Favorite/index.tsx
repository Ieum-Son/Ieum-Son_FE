import { addFavorite, deleteFavorite, getFavorite } from "@/apis/favorite";
import type {
  AddFavoriteProps,
  DeleteFavoriteProps,
  GetFavoriteResponse,
} from "@/apis/favorite/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const FAVORITE_QUERY_KEY = ["favorite"];

export const getFavoriteErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "즐겨찾기 정보를 찾을 수 없습니다.",
  },
  fallback: "즐겨찾기한 단어를 불러오는 데 실패했습니다.",
});

export const getAddFavoriteErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 단어를 찾을 수 없습니다.",
    409: "이미 즐겨찾기한 단어입니다.",
  },
  fallback: "즐겨찾기 추가에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const getDeleteFavoriteErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "이미 삭제된 단어입니다.",
  },
  fallback: "즐겨찾기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const useGetFavorite = () =>
  useQuery<GetFavoriteResponse, Error>({
    queryKey: FAVORITE_QUERY_KEY,
    queryFn: getFavorite,
  });

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId }: AddFavoriteProps) => addFavorite({ wordId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY });
    },

    onError: (error) => console.error(getAddFavoriteErrorMessage(error)),
  });
};

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId }: DeleteFavoriteProps) => deleteFavorite({ wordId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY });
    },

    onError: (error) => console.error(getDeleteFavoriteErrorMessage(error)),
  });
};
