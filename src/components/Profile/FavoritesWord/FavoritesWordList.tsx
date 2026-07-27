import React from "react";
import styled from "styled-components/native";
import FavoritesWord from "./FavoritesWord";

export default function FavoritesWordList() {
  return (
    <Wrapper>
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
      <FavoritesWord day="1" text="학습하다" studyDate="2026.07.25" />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  padding: 0px 20px;
  gap: 12px;
  margin-top: 6px;
`;
