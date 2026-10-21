import ReviewIntroStudyLayout from "@/components/Study/ReviewIntroStudy/ReviewIntroStudyLayout";
import { router } from "expo-router";

export default function StudyReviewIntro() {
  return (
    <ReviewIntroStudyLayout
      onReview={() =>
        router.push({
          pathname: "/study/StudyReview",
          params: { reviewIndex: "0" },
        })
      }
    />
  );
}
