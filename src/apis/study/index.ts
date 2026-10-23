import { api } from "@/apis";
import type {
  StudyChaptersResponse,
  StudyLessonProps,
  StudyLessonResponse,
} from "./type";

export const getStudyChapters = async () => {
  const response = await api.get<StudyChaptersResponse>("/api/study/chapters");

  return response.data;
};

export const getStudyLesson = async ({ lessonId }: StudyLessonProps) => {
  const response = await api.get<StudyLessonResponse>(
    `/api/study/lessons/${lessonId}`,
  );

  return response.data;
};
