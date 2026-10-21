import ChoiceStudyLayout from "@/components/Study/ChoiceStudy/ChoiceStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import {
  getSentenceStep,
  getStudyIndex,
  getTotalSteps,
} from "@/utils/studyProgress";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function StudyChoice() {
  const { sentenceIndex: sentenceIndexParam } = useLocalSearchParams<{
    sentenceIndex?: string;
  }>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data: daily, isPending, isError, error } = useDailyProgress();

  if (isPending) return <StudyStateScreen />;

  if (isError) {
    return (
      <StudyStateScreen message={getDailyProgressErrorMessage(error)} isError />
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

  const handleNext = () => {
    if (sentenceIndex < daily.sentences.length - 1) {
      router.push({
        pathname: "/study/StudyChoice",
        params: { sentenceIndex: String(sentenceIndex + 1) },
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
    <ChoiceStudyLayout
      day={daily.streakCount}
      step={getSentenceStep(daily, sentenceIndex)}
      totalSteps={getTotalSteps(daily)}
      sentence={sentence.sentenceKor}
      highlightWord={highlightWord}
      options={options}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={handleNext}
    />
  );
}
