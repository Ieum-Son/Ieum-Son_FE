import QueryState from "@/components/common/QueryState";
import { colors } from "@/constants/colors";
import { getCalendarErrorMessage, useCalendar } from "@/hooks/calendar";
import { useUserInfo } from "@/hooks/UserInfo";
import { toHeatmapActivity, toTodayCell } from "@/utils/streak";
import React from "react";
import styled from "styled-components/native";
import LearningHeatmap from "./LearningHeatmap";
import StreakStatCard from "./StreakStatCard";

export default function StreakOverview() {
  const { data: userInfo } = useUserInfo();
  const {
    data: calendar,
    isPending,
    isPaused,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCalendar();
  const longestStreakCount = userInfo?.longestStreakCount ?? 0;
  const monthStudyCount = userInfo?.monthStudyCount ?? 0;

  return (
    <Wrapper>
      <HeatmapArea>
        {isPending || isError ? (
          <QueryState
            isPending={isPending}
            isPaused={isPaused}
            isError={isError}
            message={isError ? getCalendarErrorMessage(error) : undefined}
            isRetrying={isRefetching}
            onRetry={() => refetch()}
          />
        ) : (
          <LearningHeatmap
            activity={toHeatmapActivity(calendar.days, calendar)}
            todayCell={toTodayCell(calendar)}
          />
        )}
      </HeatmapArea>

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

const HeatmapArea = styled.View`
  flex: 1;
`;

const Stats = styled.View`
  gap: 12px;
`;
