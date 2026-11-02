import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import { useStudySocket } from "@/hooks/studySocket";
import { goToNextStage } from "@/utils/studyNavigation";
import {
  getStudyIndex,
  getTotalSteps,
  getWordStep,
} from "@/utils/studyProgress";
import { useLocalSearchParams } from "expo-router";

export default function StudyCamera() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const {
    data: daily,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDailyProgress();
  const { status, result, errorMessage } = useStudySocket({
    ticket: daily?.sessionTicket,
    onTicketExpired: () => refetch(),
  });

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

  const isMatched = result?.wordId === word.wordId;
  const isRecognized = Boolean(isMatched && result?.recorded);
  const recognitionRate = result ? Math.round(result.confidence * 100) : 0;

  const getGuideMessage = () => {
    if (errorMessage) return errorMessage;
    if (status === "connecting") return "수어 인식 서버에 연결하는 중이에요.";
    if (status === "closed") return "연결이 끊겼어요. 화면을 다시 열어주세요.";
    if (status === "scoring") return "동작을 확인하는 중이에요.";
    if (isRecognized) return "잘했어요! 다음으로 넘어가세요.";

    if (result && !isMatched) {
      return `'${result.predicted}'(으)로 인식했어요. 다시 해볼까요?`;
    }

    return "화면 가운데에 얼굴을 맞추고, 학습한 수어를 따라해 보세요.\n동작이 완료되면 자동으로 인식됩니다.";
  };

  return (
    <CameraStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 2)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      category={word.category}
      guide={getGuideMessage()}
      description={word.definition}
      recognitionRate={recognitionRate}
      attemptCount={word.attemptCount}
      errorMessage={errorMessage}
      isSubmitting={status === "scoring"}
      onNext={
        isRecognized
          ? () => goToNextStage(daily, { name: "word", index: wordIndex })
          : undefined
      }
    />
  );
}
