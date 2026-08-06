import React from "react";
import styled from "styled-components/native";
import Th from "./Th";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DAY_BY_INDEX = ["일", "월", "화", "수", "목", "금", "토"] as const;
const MOCK_LEARNED_DAYS = new Set<(typeof WEEKDAYS)[number]>([
  "월",
  "수",
  "목",
]);

export default function ThList() {
  const today = DAY_BY_INDEX[new Date().getDay()];

  return (
    <Wrapper>
      {WEEKDAYS.map((day) => (
        <Th
          key={day}
          day={day}
          isToday={day === today}
          isLearned={MOCK_LEARNED_DAYS.has(day)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  padding: 0 12px;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;
