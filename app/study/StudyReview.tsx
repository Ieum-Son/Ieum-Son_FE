import type { DailyProgressResponse, DailyReview } from "@/apis/progress/type";
import ReviewStudyLayout from "@/components/Study/ReviewStudy/ReviewStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  getSubmitWordAttemptErrorMessage,
  useDailyProgress,
  useSubmitWordAttempt,
} from "@/hooks/progress";
import { goToNextStage } from "@/utils/studyNavigation";
import {
  getReviewStep,
  getStudyIndex,
  getTotalSteps,
} from "@/utils/studyProgress";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

const ANSWER_COUNT = 3;

const buildAnswers = (daily: DailyProgressResponse, review: DailyReview) => {
  const distractors = [
    ...daily.reviews.map((item) => item.word),
    ...daily.words.map((item) => item.word),
  ].filter((word) => word !== review.word);

  const answers = [
    review.word,
    ...Array.from(new Set(distractors)).slice(0, ANSWER_COUNT - 1),
  ];
  const offset = review.wordId % answers.length;

  return [...answers.slice(offset), ...answers.slice(0, offset)];
};

const getElapsedLabel = (elapsedHours: number) => {
  const elapsedDays = Math.floor(elapsedHours / 24);

  return elapsedDays > 0
    ? `${elapsedDays}일 전 학습했어요.`
    : "오늘 학습했어요.";
};

export default function StudyReview() {
  const { reviewIndex: reviewIndexParam } = useLocalSearchParams<{
    reviewIndex?: string;
  }>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
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

  const reviewIndex = getStudyIndex(reviewIndexParam, daily.reviews.length);
  const review = daily.reviews[reviewIndex];

  if (!review) {
    return <StudyStateScreen message="오늘 복습할 단어가 없어요." />;
  }

  const answers = buildAnswers(daily, review);
  const correctIndex = answers.indexOf(review.word);

  const handleSelect = (index: number) => {
    if (isAnswered || isSubmitting) return;

    setSelectedIndex(index);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (selectedIndex === null || isSubmitting) return;

    setErrorMessage("");

    try {
      await submitAttempt({
        wordId: review.wordId,
        passed: selectedIndex === correctIndex,
      });

      setIsAnswered(true);
    } catch (submitError) {
      setErrorMessage(getSubmitWordAttemptErrorMessage(submitError));
    }
  };

  const handleNext = () =>
    goToNextStage(daily, { name: "review", index: reviewIndex });

  return (
    <ReviewStudyLayout
      day={daily.streakCount}
      step={getReviewStep(daily, reviewIndex)}
      totalSteps={getTotalSteps(daily)}
      title={getElapsedLabel(review.elapsedHours)}
      guide="아래 영상과 일치하는 뜻의 단어를 선택해주세요"
      videoUrl={review.videoUrl}
      answers={answers}
      answerDefinition={review.definition}
      selectedIndex={selectedIndex}
      answerIndex={isAnswered ? correctIndex : null}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSelect={handleSelect}
      onSubmit={handleSubmit}
      onNext={handleNext}
    />
  );
}
