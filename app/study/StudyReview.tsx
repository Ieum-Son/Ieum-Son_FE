import ReviewStudyLayout from "@/components/Study/ReviewStudy/ReviewStudyLayout";
import { router } from "expo-router";
import { useState } from "react";

const ANSWERS = ["즐겁게", "12시에", "빨리"];

export default function StudyReview() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <ReviewStudyLayout
      day={1}
      step={5}
      totalSteps={6}
      answers={ANSWERS}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onNext={() => router.push("/study/StudyChoice")}
    />
  );
}
