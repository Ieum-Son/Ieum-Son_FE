import ModeHeatImage from "@/assets/main/mode_heat/mode_heat.png";
import { colors } from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import StreakRecovery from "./StreakRecovery";
import ThList, { type Weekday } from "./ThList";

interface WeekendStrickProps {
  streakDays: number;
  learnedDays?: readonly Weekday[];
  isLoading?: boolean;
  errorMessage?: string | null;
  recoverable?: boolean;
  recoveryCost?: number;
  goldBalance?: number;
}

export default function WeekendStrick({
  streakDays,
  learnedDays,
  isLoading,
  errorMessage,
  recoverable,
  recoveryCost,
  goldBalance,
}: WeekendStrickProps) {
  const hasStreak = streakDays > 0;

  if (isLoading) {
    return (
      <Wrapper>
        <Placeholder>
          <ActivityIndicator color={colors.primary400} />
        </Placeholder>
      </Wrapper>
    );
  }

  if (errorMessage) {
    return (
      <Wrapper>
        <Placeholder>
          <ErrorText>{errorMessage}</ErrorText>
        </Placeholder>
      </Wrapper>
    );
  }

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
            {hasStreak ? (
              <>
                <StreakCount $hasStreak>{streakDays}</StreakCount>
                <DayUnit>일</DayUnit>
                {" 연속 학습 중이에요!"}
              </>
            ) : (
              "오늘 학습하고 연속 기록을 시작해요!"
            )}
          </Content>
        </TitleGroup>
        <MoreButton
          onPress={() => router.push("/Profile/Profile")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="학습 기록 자세히 보기"
        >
          <SymbolView
            name="chevron.right"
            size={16}
            weight="semibold"
            tintColor={colors.neutral400}
            fallback={<ChevronFallback>›</ChevronFallback>}
          />
        </MoreButton>
      </Top>

      <ThList learnedDays={learnedDays} />

      {recoverable && recoveryCost !== undefined && (
        <StreakRecovery
          recoveryCost={recoveryCost}
          goldBalance={goldBalance ?? 0}
        />
      )}
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

const Placeholder = styled.View`
  width: 100%;
  height: 76px;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 14px;
  text-align: center;
`;

const MoreButton = styled.Pressable`
  align-items: center;
  justify-content: center;
`;

const ChevronFallback = styled.Text`
  color: ${colors.neutral400};
  font-size: 28px;
  line-height: 28px;
`;
