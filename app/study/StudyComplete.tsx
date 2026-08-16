import CompleteStudyLayout from "@/components/Study/CompleteStudy/CompleteStudyLayout";
import { router } from "expo-router";

export default function StudyComplete() {
  return (
    <CompleteStudyLayout
      learnedWords={5}
      earnedGold={12}
      streakDays={3}
      userName="---"
      onComplete={() => router.replace("/Main")}
    />
  );
}
