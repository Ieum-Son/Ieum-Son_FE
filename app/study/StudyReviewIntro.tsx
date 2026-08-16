import ReviewIntroStudyLayout from "@/components/Study/ReviewIntroStudy/ReviewIntroStudyLayout";
import { getStudyWordIndex } from "@/constants/studyLessons";
import { router, useLocalSearchParams } from "expo-router";

export default function StudyReviewIntro() {
  const { wordIndex: wordIndexParam } = useLocalSearchParams<{
    wordIndex?: string;
  }>();
  const wordIndex = getStudyWordIndex(wordIndexParam);

  return (
    <ReviewIntroStudyLayout
      onReview={() =>
        router.push({
          pathname: "/study/StudyReview",
          params: { wordIndex: String(wordIndex) },
        })
      }
    />
  );
}
