import type { DailyProgressResponse } from "@/apis/progress/type";
import { router } from "expo-router";
import { findNextStage, type StudyStage } from "./studyProgress";

export const goToStage = (
  stage: StudyStage,
  mode: "push" | "replace" = "push",
) => {
  if (stage.name === "complete") {
    router.dismissTo("/Main");
    router.push("/study/StudyComplete");
    return;
  }

  const href =
    stage.name === "word"
      ? {
          pathname: "/study/Study" as const,
          params: { wordIndex: String(stage.index) },
        }
      : stage.name === "sentence"
        ? {
            pathname: "/study/StudyChoice" as const,
            params: { sentenceIndex: String(stage.index) },
          }
        : {
            pathname: "/study/StudyReview" as const,
            params: { reviewIndex: String(stage.index) },
          };

  if (mode === "replace") {
    router.replace(href);
    return;
  }

  router.push(href);
};

export const goToNextStage = (
  daily: DailyProgressResponse,
  from: StudyStage,
) => {
  const next = findNextStage(daily, from);

  if (next.name === "review" && from.name !== "review") {
    router.push({
      pathname: "/study/StudyReviewIntro",
      params: { reviewIndex: String(next.index) },
    });
    return;
  }

  goToStage(next);
};
