import ReviewMediaSource from "@/assets/study_temp/image 13.png";
import ReviewStudyLayout from "@/components/Study/ReviewStudy/ReviewStudyLayout";
import {
  getStudyWordIndex,
  STUDY_LESSONS,
  STUDY_TOTAL_STEPS,
} from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const DISTRACTORS = ["12시에", "빨리", "즐겁게", "친구", "만나다", "오늘"];

export default function StudyReview() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);
  const lesson = STUDY_LESSONS[wordIndex];
  const answers = [
    lesson.word,
    ...DISTRACTORS.filter((answer) => answer !== lesson.word),
  ].slice(0, 3);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ReviewStudyLayout
      day={1}
      step={STUDY_TOTAL_STEPS}
      totalSteps={STUDY_TOTAL_STEPS}
      title={`${lesson.word}를 복습해요`}
      guide="아래 영상과 일치하는 뜻의 단어를 선택해주세요"
      mediaSource={ReviewMediaSource}
      answers={answers}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() => router.push("/study/StudyComplete")}
    />
  );
}
