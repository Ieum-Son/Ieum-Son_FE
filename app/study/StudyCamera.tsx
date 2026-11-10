import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import { useHolisticRecorder } from "@/hooks/useHolisticRecorder";
import { useStudySocket } from "@/hooks/studySocket";
import { toBareSignLabel } from "@/utils/signLabel";
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
  const { status, session, result, errorMessage, sendAttempt } = useStudySocket(
    {
      ticket: daily?.sessionTicket,
      expiresAt: daily?.expiresAt,
      onTicketExpired: () => refetch(),
    },
  );
  const { frameProcessor, isRecording, start, stop } = useHolisticRecorder();

  const toggleRecording = () => {
    if (!isRecording) {
      start();
      return;
    }

    // 동작 시작부터 끝까지를 한 메시지로 보낸다. 나눠 보내지 않는다.
    sendAttempt(stop());
  };
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

  // words와 reviews에 있는 단어만 정답으로 인정된다.
  // 세션 목록에 없으면 아무리 맞게 해도 저장되지 않는다.
  const isOutOfSession = Boolean(
    session &&
    !session.words.includes(word.word) &&
    !session.reviews.includes(word.word),
  );
  // 서버는 지금 화면의 단어를 모른다. wordId 비교는 FE가 한다.
  const isMatched = result?.wordId === word.wordId;
  // 통과는 세 가지가 다 맞아야 한다(WS 규격 4.4).
  // correct만 보고 넘기면 저장되지 않은 시도를 통과로 쳐서 진도가 어긋난다.
  const isRecognized = Boolean(
    isMatched && result?.correct && result?.recorded,
  );
  const recognitionRate = result
    ? Math.round(result.confidence * 100)
    : undefined;

  const getGuideMessage = () => {
    if (errorMessage) return errorMessage;
    if (isOutOfSession) {
      return "오늘 학습 목록과 맞지 않아요. 화면을 다시 열어주세요.";
    }
    if (status === "connecting") return "수어 인식 서버에 연결하는 중이에요.";
    if (status === "closed") return "연결이 끊겼어요. 화면을 다시 열어주세요.";
    if (status === "scoring") return "동작을 확인하는 중이에요.";
    if (isRecognized) return "잘했어요! 다음으로 넘어가세요.";

    if (result && !result.correct) {
      // predicted는 "가능1"처럼 변형 번호가 붙어 온다. 그대로 보여주지 않는다.
      return `'${toBareSignLabel(result.predicted)}'(으)로 인식했어요. 다시 해볼까요?`;
    }

    // 오늘 목록의 다른 단어가 인식된 경우다. 지금 단어의 성공으로 치지 않는다.
    if (result?.correct && !isMatched) {
      return "다른 단어가 인식됐어요. 지금 단어를 다시 해볼까요?";
    }

    if (result?.correct && !result.recorded) {
      return "인식했지만 저장하지 못했어요. 한 번 더 해주세요.";
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
      isRecording={isRecording}
      // 통과한 뒤에는 녹화 버튼을 내린다.
      // isCameraActive가 false라 카메라도 꺼져 있어서 눌러도 찍히지 않는다.
      onToggleRecording={
        status === "ready" && !isRecognized ? toggleRecording : undefined
      }
      frameProcessor={frameProcessor}
      isCameraActive={!isRecognized}
      onNext={
        isRecognized
          ? () => goToNextStage(daily, { name: "word", index: wordIndex })
          : undefined
      }
    />
  );
}
