export interface StreakDay {
  date: string;
  learned: boolean;
  intensity: number;
}

export interface GetStreakResponse {
  currentStreak: number;
  goldBalance: number;
  recoverable: boolean;
  recoveryCost: number;
  week: StreakDay[];
}
