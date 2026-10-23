import type { DailyProgressResponse } from "@/apis/progress/type";

export const STUDY_STEPS_PER_WORD = 2;

export type WordStep = 1 | 2;

export const getTotalSteps = (daily: DailyProgressResponse) =>
  daily.words.length * STUDY_STEPS_PER_WORD +
  daily.sentences.length +
  daily.reviews.length;

export const getWordStep = (wordIndex: number, wordStep: WordStep) =>
  wordIndex * STUDY_STEPS_PER_WORD + wordStep;

export const getSentenceStep = (
  daily: DailyProgressResponse,
  sentenceIndex: number,
) => daily.words.length * STUDY_STEPS_PER_WORD + sentenceIndex + 1;

export const getReviewStep = (
  daily: DailyProgressResponse,
  reviewIndex: number,
) =>
  daily.words.length * STUDY_STEPS_PER_WORD +
  daily.sentences.length +
  reviewIndex +
  1;

export const getStudyIndex = (
  value: string | string[] | undefined,
  length: number,
) => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isInteger(parsed)) return 0;

  return Math.min(Math.max(parsed, 0), Math.max(length - 1, 0));
};

export type StudyStage =
  | { name: "word"; index: number }
  | { name: "sentence"; index: number }
  | { name: "review"; index: number }
  | { name: "complete" };

const buildStages = (daily: DailyProgressResponse): StudyStage[] => [
  ...daily.words.map((_, index) => ({ name: "word" as const, index })),
  ...daily.sentences.map((_, index) => ({ name: "sentence" as const, index })),
  ...daily.reviews.map((_, index) => ({ name: "review" as const, index })),
];

const isStageDone = (daily: DailyProgressResponse, stage: StudyStage) => {
  if (stage.name === "word") return daily.words[stage.index].isMastered;
  if (stage.name === "sentence") return daily.sentences[stage.index].isCompleted;
  if (stage.name === "review") return daily.reviews[stage.index].isCompleted;

  return true;
};

export const findNextStage = (
  daily: DailyProgressResponse,
  from?: StudyStage,
): StudyStage => {
  const stages = buildStages(daily);
  const fromIndex =
    from && from.name !== "complete"
      ? stages.findIndex(
          (stage) => stage.name === from.name && stage.index === from.index,
        )
      : -1;

  const next = stages
    .slice(fromIndex + 1)
    .find((stage) => !isStageDone(daily, stage));

  return next ?? { name: "complete" };
};
