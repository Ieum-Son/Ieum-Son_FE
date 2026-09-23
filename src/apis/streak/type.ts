export interface StreakDay {
  date: string;
  learned: boolean;
}

export interface GetStreakResponse {
  currentStreak: number;
  goldBalance: number;
  recoverable: boolean;
  recoveryCost: number;
  week: StreakDay[];
}

export interface RecoverStreakResponse {
  streakCount: number;
  goldBalance: number;
  spentGold: number;
}
