import React from "react";
import styled from "styled-components/native";
import Th from "./Th";

import type { Weekday } from "@/utils/streak";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DAY_BY_INDEX = WEEKDAYS;

export type { Weekday };

interface ThListProps {
  learnedDays?: readonly Weekday[];
}

export default function ThList({ learnedDays = [] }: ThListProps) {
  const today = DAY_BY_INDEX[new Date().getDay()];

  return (
    <Wrapper>
      {WEEKDAYS.map((day) => (
        <Th
          key={day}
          day={day}
          isToday={day === today}
          isLearned={learnedDays.includes(day)}
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
