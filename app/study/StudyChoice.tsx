import ChoiceStudyLayout from "@/components/Study/ChoiceStudy/ChoiceStudyLayout";
import { useState } from "react";

const TOTAL_STEPS = 5;
const VIDEO_OPTIONS = ["영상 1", "영상 2", "영상 3", "영상 4"];

export default function StudyChoice() {
  const [step, setStep] = useState(4);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ChoiceStudyLayout
      day={1}
      step={step}
      totalSteps={TOTAL_STEPS}
      options={VIDEO_OPTIONS}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() =>
        setStep((currentStep) => Math.min(currentStep + 1, TOTAL_STEPS))
      }
    />
  );
}
