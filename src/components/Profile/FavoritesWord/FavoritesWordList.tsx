import React from "react";
import styled from "styled-components/native";
import FavoritesWord from "./FavoritesWord";

export default function FavoritesWordList() {
  return (
    <Wrapper
      contentContainerStyle={{
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  margin-top: 6px;
  padding: 0px 20px;
`;
