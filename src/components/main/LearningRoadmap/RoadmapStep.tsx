import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { default as styled } from "styled-components/native";

export interface RoadmapStepData {
  id: number;
  stepNumber: number;
  day: number;
  description: string;
  locked?: boolean;
}

interface RoadmapStepProps {
  step: RoadmapStepData;
  isLast: boolean;
}

export default function RoadmapStep({ step, isLast }: RoadmapStepProps) {
  return (
    <Wrapper>
      <StageArea>
        <Stage $locked={step.locked}>
          {step.locked ? (
            <Ionicons name="chevron-down" size={38} color={colors.neutral0} />
          ) : (
            <StageNumber>{step.stepNumber}</StageNumber>
          )}
        </Stage>
        {!isLast && <Connector $locked={step.locked} />}
      </StageArea>

      <TextArea>
        <Title $locked={step.locked}>DAY {step.day}</Title>
        <Description $locked={step.locked}>{step.description}</Description>
      </TextArea>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  min-height: 84px;
  flex-direction: row;
  align-items: flex-start;
  gap: 14px;
`;

const StageArea = styled.View`
  width: 72px;
  align-items: center;
`;

const Stage = styled.View<{ $locked?: boolean }>`
  width: 72px;
  height: 68px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border-bottom-width: 5px;
  border-bottom-color: ${({ $locked }) =>
    $locked ? colors.neutral500 : colors.primary500};
  background-color: ${({ $locked }) =>
    $locked ? colors.neutral300 : colors.primary300};
`;

const StageNumber = styled.Text`
  color: ${colors.neutral0};
  font-size: 34px;
  font-weight: 700;
`;

const Connector = styled.View<{ $locked?: boolean }>`
  width: 2px;
  height: 21px;
  border-left-width: 2px;
  border-left-style: dashed;
  border-left-color: ${({ $locked }) =>
    $locked ? colors.neutral300 : colors.neutral300};
`;

const TextArea = styled.View`
  flex: 1;
  padding-top: 6px;
`;

const Title = styled.Text<{ $locked?: boolean }>`
  color: ${({ $locked }) =>
    $locked ? colors.neutral500 : colors.primary600};
  font-size: 24px;
  font-weight: 800;
`;

const Description = styled.Text<{ $locked?: boolean }>`
  margin-top: 2px;
  color: ${({ $locked }) =>
    $locked ? colors.neutral300 : colors.neutral600};
  font-size: 15px;
  font-weight: 500;
`;
