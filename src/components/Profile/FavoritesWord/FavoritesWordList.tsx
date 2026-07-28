import React, { useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import FavoritesWord from "./FavoritesWord";

const INITIAL_FAVORITE_WORDS = [
  { id: 1, day: "1", text: "학습하다", studyDate: "2026.07.25" },
  { id: 2, day: "1", text: "학습하다", studyDate: "2026.07.25" },
  { id: 3, day: "1", text: "학습하다", studyDate: "2026.07.25" },
  { id: 4, day: "1", text: "학습하다", studyDate: "2026.07.25" },
  { id: 5, day: "1", text: "학습하다", studyDate: "2026.07.25" },
  { id: 6, day: "1", text: "학습하다", studyDate: "2026.07.25" },
];

export default function FavoritesWordList() {
  const [favoriteWords, setFavoriteWords] = useState(INITIAL_FAVORITE_WORDS);

  const confirmRemoveFavoriteWord = (id: number) => {
    Alert.alert("즐겨찾기 삭제", "정말 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setFavoriteWords((words) =>
            words.filter((word) => word.id !== id),
          );
          Alert.alert("삭제 완료", "삭제되었습니다.");
        },
      },
    ]);
  };

  return (
    <Wrapper
      contentContainerStyle={{
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      {favoriteWords.map((word) => (
        <FavoritesWord
          key={word.id}
          day={word.day}
          text={word.text}
          studyDate={word.studyDate}
          onRemove={() => confirmRemoveFavoriteWord(word.id)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  margin-top: 6px;
  padding: 0px 20px;
`;
