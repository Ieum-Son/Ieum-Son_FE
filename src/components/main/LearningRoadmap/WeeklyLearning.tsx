import { colors } from "@/constants/colors";
import { getStreakErrorMessage, useStreak } from "@/hooks/streak";
import { toWeeklyLearning } from "@/utils/streak";
import React from "react";
import { ActivityIndicator } from "react-native";
import { default as styled } from "styled-components/native";

const Y_AXIS_STEPS = 7;
const MIN_AXIS_MAX = 7;
const MAX_BAR_HEIGHT = 227;
const Y_AXIS_MARK_HEIGHT = 18;
const Y_AXIS_BOTTOM_PADDING =
  (MAX_BAR_HEIGHT - (Y_AXIS_MARK_HEIGHT * (Y_AXIS_STEPS + 1)) / 2) /
  Y_AXIS_STEPS;

export default function WeeklyLearning() {
  const { data: streak, isPending, isPaused, isError, error } = useStreak();

  if (isPaused && isPending) {
    return (
      <Placeholder>
        <Message>네트워크 연결을 확인해주세요.</Message>
      </Placeholder>
    );
  }

  if (isPending) {
    return (
      <Placeholder>
        <ActivityIndicator color={colors.primary400} />
      </Placeholder>
    );
  }

  if (isError) {
    return (
      <Placeholder>
        <Message $isError>{getStreakErrorMessage(error)}</Message>
      </Placeholder>
    );
  }

  const weekly = toWeeklyLearning(streak.week);
  const axisMax = Math.max(MIN_AXIS_MAX, ...weekly.map((point) => point.value));
  const yAxisValues = Array.from({ length: Y_AXIS_STEPS }, (_, index) =>
    Math.round((axisMax * (Y_AXIS_STEPS - index)) / Y_AXIS_STEPS),
  );

  return (
    <Wrapper>
      <Title>
        {streak.currentStreak > 0
          ? `이번 주, ${streak.currentStreak}일 연속 학습중이에요!`
          : "이번 주 학습을 시작해 볼까요?"}
      </Title>
      <Description>이번 주에 얼마나 학습했는지 살펴볼까요?</Description>

      <Chart>
        <Graph>
          <YAxis>
            {yAxisValues.map((value, index) => (
              <YAxisMark key={`${value}-${index}`}>
                <YAxisLabel>{value}</YAxisLabel>
                <YAxisTick />
              </YAxisMark>
            ))}
          </YAxis>

          <ChartBody>
            <Plot>
              {weekly.map(({ day, value, isToday }) => (
                <BarColumn key={day}>
                  {value > 0 && (
                    <Bar
                      $height={(value / axisMax) * MAX_BAR_HEIGHT}
                      $highlighted={isToday}
                    />
                  )}
                </BarColumn>
              ))}
            </Plot>

            <DayLabels>
              {weekly.map(({ day, isToday }) => (
                <DayLabel key={day} $highlighted={isToday}>
                  {day}
                </DayLabel>
              ))}
            </DayLabels>
          </ChartBody>
        </Graph>
      </Chart>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
`;

const Placeholder = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Message = styled.Text<{ $isError?: boolean }>`
  color: ${({ $isError }) => ($isError ? colors.errorRed : colors.neutral600)};
  font-size: 14px;
  text-align: center;
`;

const Title = styled.Text`
  color: ${colors.primary600};
  font-size: 20px;
  font-weight: 700;
`;

const Description = styled.Text`
  margin-top: 4px;
  color: ${colors.neutral600};
  font-size: 14px;
  font-weight: 400;
`;

const Chart = styled.View`
  width: 100%;
  margin-top: 12px;
  height: 290px;
  padding: 20px;
  border: 1px solid ${colors.neutral200};
  border-radius: 12px;
  background-color: white;
`;

const Graph = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
`;

const YAxis = styled.View`
  width: 26px;
  height: ${MAX_BAR_HEIGHT}px;
  padding-bottom: ${Y_AXIS_BOTTOM_PADDING}px;
  justify-content: space-between;
`;

const YAxisMark = styled.View`
  width: 100%;
  height: ${Y_AXIS_MARK_HEIGHT}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const YAxisLabel = styled.Text`
  width: 12px;
  text-align: right;
  color: ${colors.neutral500};
  font-size: 14px;
  line-height: 18px;
`;

const YAxisTick = styled.View`
  width: 10px;
  height: 1px;
  margin-left: 4px;
  background-color: ${colors.neutral400};
`;

const ChartBody = styled.View`
  flex: 1;
`;

const Plot = styled.View`
  height: ${MAX_BAR_HEIGHT}px;
  padding: 0 6px;
  flex-direction: row;
  align-items: flex-end;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-color: ${colors.neutral400};
`;

const BarColumn = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

const Bar = styled.View<{ $height: number; $highlighted: boolean }>`
  width: 16px;
  height: ${({ $height }) => $height}px;
  border-radius: 2px 2px 0 0;
  background-color: ${({ $highlighted }) =>
    $highlighted ? colors.primary300 : colors.primary200};
`;

const DayLabels = styled.View`
  height: 22px;
  padding: 0 6px;
  flex-direction: row;
`;

const DayLabel = styled.Text<{ $highlighted: boolean }>`
  flex: 1;
  height: 22px;
  margin-top: 4px;
  text-align: center;
  color: ${({ $highlighted }) =>
    $highlighted ? colors.primary500 : colors.neutral700};
  font-size: 14px;
`;
