import CompleteStudyLayout from "@/components/Study/CompleteStudy/CompleteStudyLayout";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import { useUserInfo } from "@/hooks/UserInfo";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";

const STUDY_COMPLETION_REWARD = 12;

export default function StudyComplete() {
  useUserInfo();
  const name = useUserStore((state) => state.user?.name);
  const { data: daily, isPending, isError, error } = useDailyProgress();

  if (isPending) return <StudyStateScreen />;

  if (isError) {
    return (
      <StudyStateScreen message={getDailyProgressErrorMessage(error)} isError />
    );
  }

  return (
    <CompleteStudyLayout
      learnedWords={daily.progress.wordsTotal}
      earnedGold={STUDY_COMPLETION_REWARD}
      streakDays={daily.streakCount}
      userName={name || "---"}
      onComplete={() => router.replace("/Main")}
    />
  );
}
