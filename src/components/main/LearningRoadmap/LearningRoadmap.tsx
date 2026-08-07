import { colors } from "@/constants/colors";
import React, { useState } from "react";
import { default as styled } from "styled-components/native";
import LearningModeTabs, {
  type LearningMode,
} from "./LearningModeTabs";
import RoadmapList from "./RoadmapList";

interface LearningRoadmapProps {
  onStartLearning?: () => void;
}

export default function LearningRoadmap({
  onStartLearning,
}: LearningRoadmapProps) {
  const [activeMode, setActiveMode] = useState<LearningMode>("roadmap");

  return (
    <Wrapper>
      <LearningModeTabs activeMode={activeMode} onChange={setActiveMode} />

      <Panel>
        <RoadmapList />
        <StartButton
          onPress={onStartLearning}
          disabled={!onStartLearning}
          accessibilityRole="button"
          accessibilityLabel="오늘의 학습 시작하기"
        >
          <StartButtonText>오늘의 학습 시작하기</StartButtonText>
        </StartButton>
      </Panel>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  margin: 1.51px 20px 20px;
`;

const Panel = styled.View`
  flex: 1;
  padding: 28px 14px 14px;
  border: 1px solid ${colors.neutral100};
  border-radius: 12px;
  background-color: ${colors.neutral50};
`;

const StartButton = styled.Pressable`
  flex-shrink: 0;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${colors.primary300};
`;

const StartButtonText = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
  font-weight: 600;
`;
