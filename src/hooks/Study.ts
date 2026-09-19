import { getStudyChapters } from "@/apis/study";
import type { StudyChaptersResponse } from "@/apis/study/type";
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
