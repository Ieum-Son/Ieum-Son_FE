import React from "react";
import styled from "styled-components/native";
import Th from "./Th";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function ThList() {
  return (
    <Wrapper>
      {WEEKDAYS.map((day) => (
        <Th key={day} day={day} />
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
