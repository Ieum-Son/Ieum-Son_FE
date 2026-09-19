import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { default as styled } from "styled-components/native";

export interface RoadmapStepData {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  wordCount: number;
  masteredWordCount: number;
  locked?: boolean;
}

interface RoadmapStepProps {
  step: RoadmapStepData;
  isLast: boolean;
  onPress?: () => void;
}

export default function RoadmapStep({
  step,
  isLast,
  onPress,
}: RoadmapStepProps) {
  return (
    <Wrapper
      onPress={onPress}
      disabled={step.locked || !onPress}
      accessibilityRole="button"
      accessibilityLabel={`${step.title} ${step.locked ? "잠김" : "학습하기"}`}
    >
      <StageArea>
        <Stage
          $locked={step.locked}
          style={{
            boxShadow: [
              {
                inset: true,
                offsetX: 0,
                offsetY: 2,
                blurRadius: 5,
                color: "rgba(255, 255, 255, 0.35)",
              },
              {
                inset: true,
                offsetX: 0,
                offsetY: -4,
                blurRadius: 0,
                color: "rgba(0, 0, 0, 0.15)",
              },
            ],
          }}
        >
          {step.locked ? (
            <Ionicons name="chevron-down" size={38} color={colors.neutral0} />
          ) : (
            <StageNumber>{step.stepNumber}</StageNumber>
          )}
        </Stage>
        {!isLast && (
          <Connector>
            <Dash />
            <Dash />
            <Dash />
          </Connector>
        )}
      </StageArea>

      <TextArea>
        <Title $locked={step.locked} numberOfLines={1}>
          {step.title}
        </Title>
        <Description $locked={step.locked} numberOfLines={1}>
          {step.description}
        </Description>
        <Progress $locked={step.locked}>
          {step.masteredWordCount} / {step.wordCount} 단어 완료
        </Progress>
      </TextArea>
    </Wrapper>
  );
}

const Wrapper = styled.Pressable`
  min-height: 88px;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const StageArea = styled.View`
  width: 72px;
  align-items: center;
`;

const Stage = styled.View<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ $locked }) =>
    $locked ? colors.neutral300 : colors.primary300};
  width: 64px;
  height: 64px;
  flex-shrink: 0;
`;

const StageNumber = styled.Text`
  color: ${colors.neutral0};
  font-size: 34px;
  font-weight: 700;
`;

const Connector = styled.View`
  width: 2px;
  height: 24px;
  justify-content: space-between;
`;

const Dash = styled.View`
  width: 2px;
  height: 6px;
  border-radius: 9999px;
  background-color: ${colors.neutral300};
`;

const TextArea = styled.View`
  flex: 1;
  padding-top: 6px;
`;

const Title = styled.Text<{ $locked?: boolean }>`
  color: ${({ $locked }) => ($locked ? colors.neutral500 : colors.primary600)};
  font-size: 24px;
  font-weight: 700;
`;

const Description = styled.Text<{ $locked?: boolean }>`
  color: ${({ $locked }) => ($locked ? colors.neutral300 : colors.neutral600)};
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
`;

const Progress = styled.Text<{ $locked?: boolean }>`
  color: ${({ $locked }) => ($locked ? colors.neutral300 : colors.primary400)};
  font-size: 13px;
  font-weight: 600;
`;
