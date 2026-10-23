import { getStudyChapters, getStudyLesson } from "@/apis/study";
import type {
  StudyChaptersResponse,
  StudyLessonResponse,
} from "@/apis/study/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "./errorResponse";

export const STUDY_CHAPTERS_QUERY_KEY = ["studyChapters"];

export const getStudyChaptersErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "학습 로드맵을 불러오는 데 실패했습니다.",
});

export const useStudyChapters = () =>
  useQuery<StudyChaptersResponse, Error>({
    queryKey: STUDY_CHAPTERS_QUERY_KEY,
    queryFn: getStudyChapters,
  });

export const STUDY_LESSON_QUERY_KEY = ["studyLesson"];

export const getStudyLessonErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 레슨이 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "레슨 정보를 불러오는 데 실패했습니다.",
});

export const useStudyLesson = (lessonId: number) =>
  useQuery<StudyLessonResponse, Error>({
    queryKey: [...STUDY_LESSON_QUERY_KEY, lessonId],
    queryFn: () => getStudyLesson({ lessonId }),
    enabled: Number.isInteger(lessonId) && lessonId > 0,
  });
