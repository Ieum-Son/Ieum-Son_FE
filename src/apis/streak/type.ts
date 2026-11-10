export interface StreakDay {
  date: string;
  learned: boolean;
  /** 그날 완료한 단어 수. 주간 그래프 막대 높이로 쓴다. */
  wordsCompleted: number;
}

export interface GetStreakResponse {
  currentStreak: number;
  goldBalance: number;
  recoverable: boolean;
  recoveryCost: number;
  /** 최근 7일(오늘 포함, Asia/Seoul) */
  week: StreakDay[];
}

export interface RecoverStreakResponse {
  streakCount: number;
  goldBalance: number;
  spentGold: number;
}
