export interface StudyLesson {
  lessonId: number;
  name: string;
  description: string;
  orderNumber: number;
  wordCount: number;
  masteredWordCount: number;
}

export interface StudyChapter {
  chapterId: number;
  title: string;
  description: string;
  orderNumber: number;
  isCurrent: boolean;
  lessons: StudyLesson[];
}

export interface StudyChaptersResponse {
  currentChapterId: number;
  chapters: StudyChapter[];
}

export interface LessonWord {
  wordId: number;
  word: string;
  definition: string;
  videoUrl: string;
  category: string;
  difficulty: number;
  isMastered: boolean;
}

export interface StudyLessonProps {
  lessonId: number;
}

export interface StudyLessonResponse {
  lessonId: number;
  name: string;
  description: string;
  chapterId: number;
  words: LessonWord[];
}
