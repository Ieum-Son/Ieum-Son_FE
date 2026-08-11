import React from "react";
import { default as styled } from "styled-components/native";
import RoadmapStep, { type RoadmapStepData } from "./RoadmapStep";

const ROADMAP_STEPS: RoadmapStepData[] = [
  { id: 1, stepNumber: 1, day: 1, description: "설명설명한줄설명아마도" },
  { id: 2, stepNumber: 1, day: 1, description: "설명설명한줄설명아마도" },
  { id: 3, stepNumber: 1, day: 1, description: "설명설명한줄설명아마도" },
  {
    id: 4,
    stepNumber: 1,
    day: 1,
    description: "설명설명한줄설명아마도",
    locked: true,
  },
];

export default function RoadmapList() {
  return (
    <Wrapper
      contentContainerStyle={{ paddingTop: 0 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
    >
      {ROADMAP_STEPS.map((step, index) => (
        <RoadmapStep
          key={step.id}
          step={step}
          isLast={index === ROADMAP_STEPS.length - 1}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  flex: 1;
`;
