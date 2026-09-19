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
