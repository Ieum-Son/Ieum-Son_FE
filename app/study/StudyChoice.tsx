import ChoiceStudyLayout from "@/components/Study/ChoiceStudy/ChoiceStudyLayout";
import {
  getStudyWordIndex,
  STUDY_TOTAL_STEPS,
} from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const VIDEO_OPTIONS = ["영상 1", "영상 2", "영상 3", "영상 4"];

export default function StudyChoice() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ChoiceStudyLayout
      day={1}
      step={STUDY_TOTAL_STEPS - 1}
      totalSteps={STUDY_TOTAL_STEPS}
      options={VIDEO_OPTIONS}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() =>
        router.push({
          pathname: "/study/StudyReviewIntro",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
