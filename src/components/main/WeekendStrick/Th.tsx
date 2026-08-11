import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

interface ThProps {
  day: string;
  isToday?: boolean;
  isLearned?: boolean;
}

export default function Th({
  day,
  isToday = false,
  isLearned = false,
}: ThProps) {
  return (
    <Wrapper
      $isLearned={isLearned}
      accessible
      accessibilityLabel={`${day}요일${isLearned ? ", 학습 완료" : ""}${isToday ? ", 오늘" : ""}`}
    >
      {isToday && <TodayDot />}
      <Content $isLearned={isLearned}>{day}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.View<{ $isLearned: boolean }>`
  display: flex;
  flex: 1;
  max-width: 36px;
  aspect-ratio: 1;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: ${({ $isLearned }) =>
    $isLearned ? colors.primary300 : colors.neutral200};
`;

const TodayDot = styled.View`
  position: absolute;
  top: -8px;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: ${colors.primary300};
`;

const Content = styled.Text<{ $isLearned: boolean }>`
  color: ${({ $isLearned }) =>
    $isLearned ? colors.neutral0 : colors.neutral400};
  font-size: 14px;
  font-weight: 400;
`;
