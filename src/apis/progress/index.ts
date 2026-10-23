import { api } from "@/apis";
import type {
  DailyProgressResponse,
  SubmitSentenceAnswerProps,
  SubmitSentenceAnswerResponse,
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
