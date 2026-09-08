import { colors } from "@/constants/colors";
import { useUserInfo } from "@/hooks/UserInfo";
import React from "react";
import styled from "styled-components/native";
import LearningHeatmap from "./LearningHeatmap";
import StreakStatCard from "./StreakStatCard";

interface StreakOverviewProps {
  activity?: boolean[][];
}

export default function StreakOverview({ activity }: StreakOverviewProps) {
  const { data: userInfo } = useUserInfo();
  const longestStreakCount = userInfo?.longestStreakCount ?? 0;
  const monthStudyCount = userInfo?.monthStudyCount ?? 0;

  return (
    <Wrapper>
      <LearningHeatmap activity={activity} />
      <Stats>
        <StreakStatCard title="최장 연속 기록" value={longestStreakCount} />
        <StreakStatCard title="이번 달 학습일" value={monthStudyCount} />
      </Stats>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 168px;
  flex-direction: row;
  gap: 20px;
  padding: 16px 20px;
  margin: 16px 10px 0px;
  background-color: ${colors.neutral50};
  border: 1px solid ${colors.neutral100};
  border-radius: 12px;
`;

const Stats = styled.View`
  gap: 12px;
`;
