import ReviewStudyLayout from "@/components/Study/ReviewStudy/ReviewStudyLayout";
import { STUDY_TOTAL_STEPS } from "@/constants/studyLessons";
import { router } from "expo-router";
import { useState } from "react";

const ANSWERS = ["즐겁게", "12시에", "빨리"];

export default function StudyReview() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ReviewStudyLayout
      day={1}
      step={STUDY_TOTAL_STEPS}
      totalSteps={STUDY_TOTAL_STEPS}
      answers={ANSWERS}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() => router.push("/study/StudyComplete")}
    />
  );
}
