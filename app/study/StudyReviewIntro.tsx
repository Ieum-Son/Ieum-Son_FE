import ReviewIntroStudyLayout from "@/components/Study/ReviewIntroStudy/ReviewIntroStudyLayout";
import { goToStage } from "@/utils/studyNavigation";
import { useLocalSearchParams } from "expo-router";

export default function StudyReviewIntro() {
  const { reviewIndex: reviewIndexParam } = useLocalSearchParams<{
    reviewIndex?: string;
  }>();
  const reviewIndex = Number(reviewIndexParam) || 0;

  return (
    <ReviewIntroStudyLayout
      onReview={() => goToStage({ name: "review", index: reviewIndex })}
    />
  );
}
