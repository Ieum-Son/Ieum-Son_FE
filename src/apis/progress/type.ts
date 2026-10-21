export type DailyProgressStep = "WORD" | (string & {});

export interface DailyWord {
  wordId: number;
  word: string;
  definition: string;
  videoUrl: string;
  category: string;
  difficulty: number;
  bestAccuracy: number;
  attemptCount: number;
  isMastered: boolean;
}

export interface DailySentenceOption {
  wordId: number;
  word: string;
  videoUrl: string;
}

export interface DailySentence {
  sentenceId: number;
  sentenceKor: string;
  isCompleted: boolean;
  options: DailySentenceOption[];
}

export interface DailyReview {
  wordId: number;
  word: string;
  definition: string;
  videoUrl: string;
  lastPracticedAt: string;
  elapsedHours: number;
  timeLimitSeconds: number;
  isCompleted: boolean;
}

export interface DailyProgressSummary {
  wordsCompleted: number;
  wordsTotal: number;
  sentencesCompleted: number;
  sentencesTotal: number;
  reviewsCompleted: number;
  reviewsTotal: number;
}

export interface DailyProgressResponse {
  date: string;
  sessionId: number;
  sessionTicket: string;
  expiresAt: string;
  streakCount: number;
  completed: boolean;
  goldAwarded: boolean;
  step: DailyProgressStep;
  words: DailyWord[];
  sentences: DailySentence[];
  reviews: DailyReview[];
  progress: DailyProgressSummary;
}
