import CameraImageSource from "@/assets/study_temp/camera.png";
import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  getSubmitWordAttemptErrorMessage,
  useDailyProgress,
  useSubmitWordAttempt,
} from "@/hooks/progress";
import { goToNextStage } from "@/utils/studyNavigation";
import {
  getStudyIndex,
  getTotalSteps,
  getWordStep,
} from "@/utils/studyProgress";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

const MOCK_RECOGNITION_RATE = 92;
const MOCK_RECOGNITION_PASSED = true;

export default function StudyCamera() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    data: daily,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDailyProgress();
  const { mutateAsync: submitAttempt, isPending: isSubmitting } =
    useSubmitWordAttempt();

  if (isPending) return <StudyStateScreen />;

  if (isError) {
    return (
      <StudyStateScreen
        message={getDailyProgressErrorMessage(error)}
        isError
        isRetrying={isRefetching}
        onRetry={() => refetch()}
      />
    );
  }

  const wordIndex = getStudyIndex(wordIndexParam, daily.words.length);
  const word = daily.words[wordIndex];

  if (!word) return <StudyStateScreen message="오늘 학습할 단어가 없어요." />;

  const handleNext = async () => {
    if (isSubmitting) return;

    setErrorMessage("");

    try {
      await submitAttempt({
        wordId: word.wordId,
        passed: MOCK_RECOGNITION_PASSED,
      });
    } catch (submitError) {
      setErrorMessage(getSubmitWordAttemptErrorMessage(submitError));
      return;
    }

    goToNextStage(daily, { name: "word", index: wordIndex });
  };

  return (
    <CameraStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 2)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      category={word.category}
      guide={
        "화면 가운데에 얼굴을 맞추고, 학습한 수어를 따라해 보세요.\n동작이 완료되면 자동으로 인식됩니다."
      }
      description={word.definition}
      imageSource={CameraImageSource}
      recognitionRate={MOCK_RECOGNITION_RATE}
      attemptCount={word.attemptCount}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onNext={handleNext}
    />
  );
}
