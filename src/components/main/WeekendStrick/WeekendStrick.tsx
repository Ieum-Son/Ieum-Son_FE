import ModeHeatImage from "@/assets/main/mode_heat/mode_heat.png";
import { colors } from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import React from "react";
import styled from "styled-components/native";
import ThList, { type Weekday } from "./ThList";

interface WeekendStrickProps {
  streakDays: number;
  learnedDays?: readonly Weekday[];
}

export default function WeekendStrick({
  streakDays,
  learnedDays,
}: WeekendStrickProps) {
  const hasStreak = streakDays > 0;

  return (
    <Wrapper>
      <Top>
        <TitleGroup>
          <Icon
            source={ModeHeatImage}
            resizeMode="contain"
            accessibilityLabel="연속 학습"
          />
          <Content>
            <StreakCount $hasStreak={hasStreak}>{streakDays}</StreakCount>
            <DayUnit>일</DayUnit>
            {" 연속 학습 중이에요!"}
          </Content>
        </TitleGroup>
        <SymbolView
          name="chevron.right"
          size={16}
          weight="semibold"
          tintColor={colors.neutral400}
          fallback={<ChevronFallback>›</ChevronFallback>}
        />
      </Top>

      <ThList learnedDays={learnedDays} />
    </Wrapper>
  );
}

const Top = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Wrapper = styled.View`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  border-radius: 12px;
  border: 1px solid ${colors.neutral100};
  background-color: ${colors.neutral50};
  margin: 20px;
`;

const Icon = styled.Image`
  width: 15px;
  height: 17.606px;
  aspect-ratio: 15/17.61;
`;

const Content = styled.Text`
  color: ${colors.neutral700};
  font-size: 18px;
  font-weight: 600;
`;

const StreakCount = styled.Text<{ $hasStreak: boolean }>`
  color: ${({ $hasStreak }) =>
    $hasStreak ? colors.primary300 : colors.neutral1000};
  font-size: 18px;
  font-weight: 600;
`;

const DayUnit = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

const ChevronFallback = styled.Text`
  color: ${colors.neutral400};
  font-size: 28px;
  line-height: 28px;
`;
