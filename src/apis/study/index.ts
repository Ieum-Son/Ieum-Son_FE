import { api } from "@/apis";
import { StudyChaptersResponse } from "./type";

export const getStudyChapters = async () => {
  const response = await api.get<StudyChaptersResponse>("/api/study/chapters");

  return response.data;
};
