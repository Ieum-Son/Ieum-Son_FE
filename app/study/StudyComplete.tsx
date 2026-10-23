import CompleteStudyLayout from "@/components/Study/CompleteStudy/CompleteStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getCompleteDailyProgressErrorMessage,
  useCompleteDailyProgress,
} from "@/hooks/progress";
import { useUserInfo } from "@/hooks/UserInfo";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

export default function StudyComplete() {
  useUserInfo();
  const name = useUserStore((state) => state.user?.name);
  const hasRequested = useRef(false);
  const {
    mutate: completeStudy,
    data,
    isError,
    error,
  } = useCompleteDailyProgress();

  useEffect(() => {
    if (hasRequested.current) return;

    hasRequested.current = true;
    completeStudy();
  }, [completeStudy]);

  if (!data) {
    return (
      <StudyStateScreen
        message={
          isError ? getCompleteDailyProgressErrorMessage(error) : undefined
        }
        isError={isError}
      />
    );
  }

  return (
    <CompleteStudyLayout
      learnedWords={data.wordsCompleted}
      earnedGold={data.goldEarned}
      goldFromWords={data.goldFromWords}
      streakBonus={data.streakBonus}
      streakDays={data.streakCount}
      userName={name || "---"}
      onComplete={() => router.dismissTo("/Main")}
    />
  );
}
