import { api } from "@/apis";
import type {
  CompleteDailyProgressResponse,
  DailyProgressResponse,
  SubmitSentenceAnswerProps,
  SubmitSentenceAnswerResponse,
  SubmitWordAttemptProps,
  SubmitWordAttemptResponse,
} from "./type";

export const getDailyProgress = async () => {
  const response = await api.get<DailyProgressResponse>("/api/progress/daily");

  return response.data;
};

export const submitSentenceAnswer = async ({
  sentenceId,
  selectedWordId,
}: SubmitSentenceAnswerProps) => {
  const response = await api.post<SubmitSentenceAnswerResponse>(
    `/api/progress/sentences/${sentenceId}/answers`,
    { selectedWordId },
  );

  return response.data;
};

export const completeDailyProgress = async () => {
  const response = await api.post<CompleteDailyProgressResponse>(
    "/api/progress/complete",
  );

  return response.data;
};

export const submitWordAttempt = async ({
  wordId,
  passed,
}: SubmitWordAttemptProps) => {
  const response = await api.post<SubmitWordAttemptResponse>(
    `/internal/words/${wordId}/attempts`,
    { passed },
  );

  return response.data;
};
