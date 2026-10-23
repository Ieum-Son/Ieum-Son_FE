import type { SubmitSentenceAnswerResponse } from "@/apis/progress/type";
import ChoiceStudyLayout from "@/components/Study/ChoiceStudy/ChoiceStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  getSubmitSentenceAnswerErrorMessage,
  useDailyProgress,
  useSubmitSentenceAnswer,
} from "@/hooks/progress";
import { goToNextStage } from "@/utils/studyNavigation";
import {
  getSentenceStep,
  getStudyIndex,
  getTotalSteps,
} from "@/utils/studyProgress";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

const MAX_ATTEMPTS = 2;

interface SubmittedAnswer {
  response: SubmitSentenceAnswerResponse;
  alreadyCompleted: boolean;
}

export default function StudyChoice() {
  const { sentenceIndex: sentenceIndexParam } = useLocalSearchParams<{
    sentenceIndex?: string;
  }>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState<SubmittedAnswer | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [notice, setNotice] = useState("");
  const {
    data: daily,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDailyProgress();
  const { mutateAsync: submitAnswer, isPending: isSubmitting } =
    useSubmitSentenceAnswer();

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

  const sentenceIndex = getStudyIndex(
    sentenceIndexParam,
    daily.sentences.length,
  );
  const sentence = daily.sentences[sentenceIndex];

  if (!sentence) {
    return <StudyStateScreen message="오늘 풀 문장 문제가 없어요." />;
  }

  const highlightWord = sentence.options.find((option) =>
    sentence.sentenceKor.includes(option.word),
  )?.word;

  const options = sentence.options.map((option, index) => ({
    label: `영상 ${index + 1}`,
    videoUrl: option.videoUrl,
  }));

  const answerIndex = answer
    ? sentence.options.findIndex(
        (option) => option.wordId === answer.response.answerWordId,
      )
    : -1;

  const result =
    answer && answerIndex !== -1
      ? {
          correct: answer.response.correct,
          alreadyCompleted: answer.alreadyCompleted,
          answerIndex,
          answerLabel: options[answerIndex].label,
        }
      : null;

  const handleSelect = (index: number) => {
    if (answer || isSubmitting) return;

    setSelectedIndex(index);
    setNotice("");
  };

  const handleSubmit = async () => {
    if (selectedIndex === null || isSubmitting) return;

    setNotice("");

    const alreadyCompleted = sentence.isCompleted;

    try {
      const submitted = await submitAnswer({
        sentenceId: sentence.sentenceId,
        selectedWordId: sentence.options[selectedIndex].wordId,
      });
      const nextAttemptCount = attemptCount + 1;

      setAttemptCount(nextAttemptCount);

      if (
        submitted.correct ||
        alreadyCompleted ||
        nextAttemptCount >= MAX_ATTEMPTS
      ) {
        setAnswer({ response: submitted, alreadyCompleted });
        return;
      }

      setNotice("아쉬워요. 한 번 더 선택해보세요.");
    } catch (submitError) {
      setNotice(getSubmitSentenceAnswerErrorMessage(submitError));
    }
  };

  const handleNext = () =>
    goToNextStage(daily, { name: "sentence", index: sentenceIndex });

  return (
    <ChoiceStudyLayout
      day={daily.streakCount}
      step={getSentenceStep(daily, sentenceIndex)}
      totalSteps={getTotalSteps(daily)}
      sentence={sentence.sentenceKor}
      highlightWord={highlightWord}
      options={options}
      selectedIndex={selectedIndex}
      result={result}
      notice={notice}
      isSubmitting={isSubmitting}
      onSelect={handleSelect}
      onSubmit={handleSubmit}
      onNext={handleNext}
    />
  );
}
