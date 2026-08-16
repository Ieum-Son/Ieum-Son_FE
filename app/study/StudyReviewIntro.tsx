import ReviewIntroStudyLayout from "@/components/Study/ReviewIntroStudy/ReviewIntroStudyLayout";
import { router } from "expo-router";

export default function StudyReviewIntro() {
  return (
    <ReviewIntroStudyLayout
      onReview={() => router.push("/study/StudyChoice")}
    />
  );
}
