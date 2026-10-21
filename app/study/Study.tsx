import StudyStateScreen from "@/components/Study/StudyStateScreen";
import VideoStudyLayout from "@/components/Study/VideoStudy/VideoStudyLayout";
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

export default function Study() {
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

  return (
    <VideoStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 1)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      guide="아래 영상을 보고 따라하며 수어를 학습해보세요."
      description={word.definition}
      videoUrl={word.videoUrl}
      onNext={() =>
        router.push({
          pathname: "/study/StudyImage",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
