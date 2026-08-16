import CompleteStudyLayout from "@/components/Study/CompleteStudy/CompleteStudyLayout";
import { STUDY_LESSONS } from "@/constants/studyLessons";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";

export default function StudyComplete() {
  const user = useUserStore((state) => state.user);

  return (
    <CompleteStudyLayout
      learnedWords={STUDY_LESSONS.length}
      userName={user?.name || user?.loginId || "사용자"}
      onComplete={() => router.replace("/Main")}
    />
  );
}
