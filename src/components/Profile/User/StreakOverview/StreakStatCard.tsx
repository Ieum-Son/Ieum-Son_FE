import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

interface StreakStatCardProps {
  title: string;
  value: number;
  unit?: string;
}

export default function StreakStatCard({
  title,
  value,
  unit = "일",
}: StreakStatCardProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <ValueRow>
        <Value>{value}</Value>
        <Unit>{unit}</Unit>
      </ValueRow>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 8px 16px;
  height: 62px;
  border: 1px solid ${colors.neutral100};
  background-color: white;
`;

const Title = styled.Text`
  color: ${colors.neutral600};
  text-align: center;
  font-size: 12px;
  font-weight: 400;
`;

const ValueRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Value = styled.Text`
  color: ${colors.primary400};
  font-weight: 600;
  font-variant: tabular-nums;
  text-align: center;
  font-size: 20px;
`;

const Unit = styled.Text`
  padding-bottom: 3px;
  color: ${colors.neutral600};
  text-align: center;
  font-size: 14px;
  font-weight: 400;
`;
