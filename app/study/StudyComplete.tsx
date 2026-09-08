import CompleteStudyLayout from "@/components/Study/CompleteStudy/CompleteStudyLayout";
import { STUDY_LESSONS } from "@/constants/studyLessons";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";

const STUDY_COMPLETION_REWARD = 12;
const STUDY_COMPLETION_STREAK_DAYS = 3;

export default function StudyComplete() {
  const name = useUserStore((state) => state.user?.name);

  return (
    <CompleteStudyLayout
      learnedWords={STUDY_LESSONS.length}
      earnedGold={STUDY_COMPLETION_REWARD}
      streakDays={STUDY_COMPLETION_STREAK_DAYS}
      userName={name || "---"}
      onComplete={() => router.replace("/Main")}
    />
  );
}
