import StudyStateScreen from "@/components/Study/StudyStateScreen";
import VideoStudyLayout from "@/components/Study/VideoStudy/VideoStudyLayout";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import { goToStage } from "@/utils/studyNavigation";
import {
  findNextStage,
  getStudyIndex,
  getTotalSteps,
  getWordStep,
} from "@/utils/studyProgress";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Study() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const {
    data: daily,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching,
  } = useDailyProgress();
  const isEntry = wordIndexParam === undefined;

  useEffect(() => {
    if (!daily || isFetching || !isEntry) return;

    goToStage(findNextStage(daily), "replace");
  }, [daily, isFetching, isEntry]);

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

  if (isEntry) return <StudyStateScreen />;

  const wordIndex = getStudyIndex(wordIndexParam, daily.words.length);
  const word = daily.words[wordIndex];

  if (!word) return <StudyStateScreen message="오늘 학습할 단어가 없어요." />;

  return (
    <VideoStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 1)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      category={word.category}
      guide="아래 영상을 보고 따라하며 수어를 학습해보세요."
      description={word.definition}
      videoUrl={word.videoUrl}
      onNext={() =>
        router.push({
          pathname: "/study/StudyCamera",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
