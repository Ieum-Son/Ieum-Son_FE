import { colors } from "@/constants/colors";
import {
  getAddFavoriteErrorMessage,
  getDeleteFavoriteErrorMessage,
  getFavoriteErrorMessage,
  useAddFavorite,
  useDeleteFavorite,
  useGetFavorite,
} from "@/hooks/Favorite";
import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import FavoritesWord from "./FavoritesWord";

export default function FavoritesWordList() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite();
  const { mutate: restoreFavorite } = useAddFavorite();

  const favoriteWords = data?.items ?? [];

  const restoreFavoriteWord = (wordId: number) => {
    restoreFavorite(
      { wordId },
      {
        onError: (restoreError) =>
          Alert.alert(
            "실행 취소 실패",
            getAddFavoriteErrorMessage(restoreError),
          ),
      },
    );
  };

  const removeFavoriteWord = (wordId: number) => {
    removeFavorite(
      { wordId },
      {
        onSuccess: () =>
          Alert.alert("삭제 완료", "즐겨찾기에서 삭제되었습니다.", [
            { text: "확인" },
            {
              text: "실행 취소",
              onPress: () => restoreFavoriteWord(wordId),
            },
          ]),
        onError: (removeError) =>
          Alert.alert("삭제 실패", getDeleteFavoriteErrorMessage(removeError)),
      },
    );
  };

  const confirmRemoveFavoriteWord = (wordId: number, word: string) => {
    Alert.alert("즐겨찾기 삭제", `'${word}'을(를) 즐겨찾기에서 삭제할까요?`, [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => removeFavoriteWord(wordId),
      },
    ]);
  };

  if (isLoading) {
    return (
      <Placeholder>
        <ActivityIndicator color={colors.primary400} />
      </Placeholder>
    );
  }

  if (isError) {
    return (
      <Placeholder>
        <Message>{getFavoriteErrorMessage(error)}</Message>
        <Retry
          onPress={() => refetch()}
          disabled={isRefetching}
          accessibilityRole="button"
          accessibilityLabel="즐겨찾기 목록 다시 불러오기"
        >
          <RetryText>다시 시도</RetryText>
        </Retry>
      </Placeholder>
    );
  }

  if (favoriteWords.length === 0) {
    return (
      <Placeholder>
        <Message>즐겨찾기한 단어가 없습니다.</Message>
      </Placeholder>
    );
  }

  return (
    <Wrapper
      contentContainerStyle={{
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      {favoriteWords.map((favoriteWord) => (
        <FavoritesWord
          key={favoriteWord.wordId}
          category={favoriteWord.category}
          word={favoriteWord.word}
          recentLearnedDate={favoriteWord.recentLearnedDate}
          disabled={isRemoving}
          onRemove={() =>
            confirmRemoveFavoriteWord(favoriteWord.wordId, favoriteWord.word)
          }
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  margin-top: 6px;
  padding: 0px 20px;
`;

const Placeholder = styled.View`
  flex: 1;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

const Message = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
`;

const Retry = styled.Pressable`
  padding: 8px 16px;
  border-radius: 999px;
  background-color: ${colors.primary100};
`;

const RetryText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary400};
`;
