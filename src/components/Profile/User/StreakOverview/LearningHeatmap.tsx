import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DEFAULT_ACTIVITY = [
  [false, true, true, false, true, true, false],
  [false, true, true, false, true, true, false],
  [false, true, true, false, true, true, false],
  [true, true, true, false, true, true, false],
  [true, true, true, false, true, true, false],
  [true, true, false, false, false, true, false],
  [true, false, true, false, true, true, false],
];

interface LearningHeatmapProps {
  activity?: boolean[][];
}

export default function LearningHeatmap({
  activity = DEFAULT_ACTIVITY,
}: LearningHeatmapProps) {
  return (
    <Wrapper>
      {DAYS.map((day, rowIndex) => {
        const rowActivity = activity[rowIndex] ?? [];

        return (
          <Row key={day}>
            <Day>{day}</Day>
            <Cells>
              {Array.from({ length: 7 }, (_, columnIndex) => (
                <Cell
                  key={`${day}-${columnIndex}`}
                  $active={rowActivity[columnIndex] ?? false}
                  $outlined={rowIndex === 0 && columnIndex === 6}
                />
              ))}
            </Cells>
          </Row>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  height: 134px;
  justify-content: space-between;
`;

const Row = styled.View`
  height: 16px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const Day = styled.Text`
  width: 16px;
  color: ${colors.neutral500};
  font-size: 14px;
  line-height: 16px;
`;

const Cells = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const Cell = styled.View<{ $active: boolean; $outlined: boolean }>`
  width: 16px;
  height: 16px;
  border-width: ${({ $outlined }) => ($outlined ? "1px" : "0px")};
  border-color: ${colors.primary300};
  border-radius: 2px;
  background-color: ${({ $active }) =>
    $active ? colors.primary300 : colors.neutral200};
`;
