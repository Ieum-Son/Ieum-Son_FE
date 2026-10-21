import StudyImageSource from "@/assets/study_temp/image 13.png";
import ImageStudyLayout from "@/components/Study/ImageStudy/ImageStudyLayout";
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

export default function StudyImage() {
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
    <ImageStudyLayout
      day={daily.streakCount}
      step={getWordStep(wordIndex, 2)}
      totalSteps={getTotalSteps(daily)}
      word={word.word}
      guide="아래 수형 사진을 보고 따라하며 수어를 학습해보세요."
      description={word.definition}
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
