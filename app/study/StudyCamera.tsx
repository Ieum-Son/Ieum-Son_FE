import CameraImageSource from "@/assets/study_temp/camera.png";
import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import {
  getStudyWordIndex,
  STUDY_LESSONS,
  STUDY_STEPS_PER_WORD,
  STUDY_TOTAL_STEPS,
} from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";

// 예외 화면 확인 시 0은 거리 오류, 1은 얼굴 인식 오류로 변경합니다.
const MOCK_RECOGNITION_RATE = 92;

export default function StudyCamera() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);
  const lesson = STUDY_LESSONS[wordIndex];
  const isLastWord = wordIndex === STUDY_LESSONS.length - 1;

  const handleNext = () => {
    if (isLastWord) {
      router.push("/study/StudyChoice");
      return;
    }

    router.push({
      pathname: "/study/Study",
      params: { wordIndex: String(wordIndex + 1) },
    });
  };

  return (
    <CameraStudyLayout
      day={1}
      step={wordIndex * STUDY_STEPS_PER_WORD + 3}
      totalSteps={STUDY_TOTAL_STEPS}
      word={lesson.word}
      guide={
        "화면 가운데에 얼굴을 맞추고, 학습한 수어를 따라해 보세요.\n동작이 완료되면 자동으로 인식됩니다."
      }
      description={lesson.description}
      imageSource={CameraImageSource}
      recognitionRate={MOCK_RECOGNITION_RATE}
      onNext={handleNext}
    />
  );
}
