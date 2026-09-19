import { addFavorite, deleteFavorite, getFavorite } from "@/apis/favorite";
import type { GetFavoriteResponse } from "@/apis/favorite/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const FAVORITE_QUERY_KEY = ["favorite"];

export const getFavoriteErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "즐겨찾기한 단어를 불러오는 데 실패했습니다.",
});

export const getAddFavoriteErrorMessage = createErrorMessage({
  status: {
    400: "학습을 완료한 단어만 즐겨찾기할 수 있습니다.",
    401: "인증이 필요합니다.",
    404: "해당 단어가 존재하지 않습니다.",
    409: "이미 즐겨찾기한 단어입니다.",
  },
  preferServerMessage: true,
  fallback: "즐겨찾기 추가에 실패했습니다. 잠시 후 다시 시도해주세요.",
});

export const getDeleteFavoriteErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "즐겨찾기한 단어가 아닙니다.",
  },
  preferServerMessage: true,
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
    mutationFn: addFavorite,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY }),

    onError: (error) => console.error(getAddFavoriteErrorMessage(error)),
  });
};

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,

    onMutate: async ({ wordId }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITE_QUERY_KEY });
      const previous =
        queryClient.getQueryData<GetFavoriteResponse>(FAVORITE_QUERY_KEY);

      queryClient.setQueryData<GetFavoriteResponse>(
        FAVORITE_QUERY_KEY,
        (cached) =>
          cached
            ? {
                ...cached,
                items: cached.items.filter((item) => item.wordId !== wordId),
              }
            : cached,
      );

      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITE_QUERY_KEY, context.previous);
      }
      queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY });
      console.error(getDeleteFavoriteErrorMessage(error));
    },
  });
};
