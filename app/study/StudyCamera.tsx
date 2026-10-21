import CameraImageSource from "@/assets/study_temp/camera.png";
import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import {
  getStudyIndex,
  getTotalSteps,
  getWordStep,
} from "@/utils/studyProgress";
import { router, useLocalSearchParams } from "expo-router";

const MOCK_RECOGNITION_RATE = 92;

export default function StudyCamera() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const { data: daily, isPending, isError, error } = useDailyProgress();

  if (isPending) return <StudyStateScreen />;

  if (isError) {
    return (
      <StudyStateScreen message={getDailyProgressErrorMessage(error)} isError />
    );
  }

  const wordIndex = getStudyIndex(wordIndexParam, daily.words.length);
  const word = daily.words[wordIndex];

  if (!word) return <StudyStateScreen message="오늘 학습할 단어가 없어요." />;

  const handleNext = () => {
    if (wordIndex < daily.words.length - 1) {
      router.push({
        pathname: "/study/Study",
        params: { wordIndex: String(wordIndex + 1) },
      });
      return;
    }

    if (daily.sentences.length > 0) {
      router.push({
        pathname: "/study/StudyChoice",
        params: { sentenceIndex: "0" },
      });
      return;
    }

    if (daily.reviews.length > 0) {
      router.push("/study/StudyReviewIntro");
      return;
    }

    router.replace("/study/StudyComplete");
  };

  return (
    <CameraStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 3)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      guide={
        "화면 가운데에 얼굴을 맞추고, 학습한 수어를 따라해 보세요.\n동작이 완료되면 자동으로 인식됩니다."
      }
      description={word.definition}
      imageSource={CameraImageSource}
      recognitionRate={MOCK_RECOGNITION_RATE}
      onNext={handleNext}
    />
  );
}
