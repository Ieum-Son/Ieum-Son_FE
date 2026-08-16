import ChoiceStudyLayout from "@/components/Study/ChoiceStudy/ChoiceStudyLayout";
import { STUDY_TOTAL_STEPS } from "@/constants/studyLessons";
import { router } from "expo-router";
import { useState } from "react";

const VIDEO_OPTIONS = ["영상 1", "영상 2", "영상 3", "영상 4"];

export default function StudyChoice() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ChoiceStudyLayout
      day={1}
      step={STUDY_TOTAL_STEPS - 1}
      totalSteps={STUDY_TOTAL_STEPS}
      options={VIDEO_OPTIONS}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() => router.push("/study/StudyReviewIntro")}
    />
  );
}
