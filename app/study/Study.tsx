import VideoStudyLayout from "@/components/Study/VideoStudy/VideoStudyLayout";
import {
  getStudyWordIndex,
  STUDY_LESSONS,
  STUDY_STEPS_PER_WORD,
  STUDY_TOTAL_STEPS,
} from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";

export default function Study() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);
  const lesson = STUDY_LESSONS[wordIndex];

  return (
    <VideoStudyLayout
      day={1}
      step={wordIndex * STUDY_STEPS_PER_WORD + 1}
      totalSteps={STUDY_TOTAL_STEPS}
      word={lesson.word}
      guide="아래 영상을 보고 따라하며 수어를 학습해보세요."
      description={lesson.description}
      onNext={() =>
        router.push({
          pathname: "/study/StudyImage",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
