import type { DailyProgressResponse } from "@/apis/progress/type";

export const STUDY_STEPS_PER_WORD = 3;

export type WordStep = 1 | 2 | 3;

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
