export const STUDY_LESSONS = [
  {
    word: "학습하다",
    description:
      "오른 주먹의 1-2지를 펴서 바닥이 왼쪽으로 향하게 비스듬히 세워 위로 올리며 동시에 올린 왼쪽으로 잡는다.",
  },
  {
    word: "즐겁게",
    description:
      "영상과 수형을 참고해 ‘즐겁게’ 수어 동작을 천천히 따라 합니다.",
  },
  {
    word: "친구",
    description:
      "영상과 수형을 참고해 ‘친구’ 수어 동작을 천천히 따라 합니다.",
  },
  {
    word: "만나다",
    description:
      "영상과 수형을 참고해 ‘만나다’ 수어 동작을 천천히 따라 합니다.",
  },
  {
    word: "오늘",
    description:
      "영상과 수형을 참고해 ‘오늘’ 수어 동작을 천천히 따라 합니다.",
  },
] as const;

export const STUDY_STEPS_PER_WORD = 3;
export const STUDY_TOTAL_STEPS = STUDY_LESSONS.length * STUDY_STEPS_PER_WORD + 2;

export function getStudyWordIndex(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isInteger(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, 0), STUDY_LESSONS.length - 1);
}
