import StudyLayout from "@/components/Study/StudyLayout";
import { useState } from "react";

const TOTAL_STEPS = 5;

export default function Study() {
  const [step, setStep] = useState(1);

  return (
    <StudyLayout
      day={1}
      step={step}
      totalSteps={TOTAL_STEPS}
      word="학습하다"
      guide="아래 영상을 보고 따라하며 수어를 학습해보세요."
      description="오른 주먹의 1-2지를 펴서 바닥이 왼쪽으로 향하게 비스듬히 세워 위로 올리며 동시에 올린 왼쪽으로 잡는다."
      onNext={() =>
        setStep((currentStep) => Math.min(currentStep + 1, TOTAL_STEPS))
      }
    />
  );
}
