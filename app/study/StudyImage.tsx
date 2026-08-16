import StudyImageSource from "@/assets/study_temp/image 13.png";
import ImageStudyLayout from "@/components/Study/ImageStudy/ImageStudyLayout";
import {
  getStudyWordIndex,
  STUDY_LESSONS,
  STUDY_STEPS_PER_WORD,
  STUDY_TOTAL_STEPS,
} from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";

export default function StudyImage() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);
  const lesson = STUDY_LESSONS[wordIndex];

  return (
    <ImageStudyLayout
      day={1}
      step={wordIndex * STUDY_STEPS_PER_WORD + 2}
      totalSteps={STUDY_TOTAL_STEPS}
      word={lesson.word}
      guide="아래 수형 사진을 보고 따라하며 수어를 학습해보세요."
      description={lesson.description}
      imageSource={StudyImageSource}
      onNext={() =>
        router.push({
          pathname: "/study/StudyCamera",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
