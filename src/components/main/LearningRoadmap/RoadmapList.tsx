import type { StudyChapter, StudyLesson } from "@/apis/study/type";
import { colors } from "@/constants/colors";
import { getStudyChaptersErrorMessage, useStudyChapters } from "@/hooks/Study";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { default as styled } from "styled-components/native";
import ChapterTitle from "./ChapterTitle";
import RoadmapStep, { type RoadmapStepData } from "./RoadmapStep";

const isMastered = (lesson: StudyLesson) =>
  lesson.masteredWordCount >= lesson.wordCount;

const byOrder = <T extends { orderNumber: number }>(items?: T[]) =>
  [...(items ?? [])].sort((a, b) => a.orderNumber - b.orderNumber);

interface ChapterSection {
  chapter: StudyChapter;
  steps: RoadmapStepData[];
}

const toSections = (
  chapters: StudyChapter[],
  currentChapterId: number,
): ChapterSection[] => {
  const sorted = byOrder(chapters);
  const currentIndex = sorted.findIndex(
    (chapter) => chapter.chapterId === currentChapterId,
  );

  return sorted.map((chapter, chapterIndex) => {
    const lessons = byOrder(chapter.lessons);
    const isPastChapter = currentIndex !== -1 && chapterIndex < currentIndex;
    const isFutureChapter = currentIndex !== -1 && chapterIndex > currentIndex;
    const firstUnfinishedIndex = lessons.findIndex(
      (lesson) => !isMastered(lesson),
    );

    return {
      chapter,
      steps: lessons.map((lesson, lessonIndex) => ({
        id: lesson.lessonId,
        stepNumber: lesson.orderNumber,
        title: `Lesson ${lesson.orderNumber}`,
        description: lesson.name,
        wordCount: lesson.wordCount,
        masteredWordCount: lesson.masteredWordCount,
        locked: isPastChapter
          ? false
          : isFutureChapter ||
            (firstUnfinishedIndex !== -1 && lessonIndex > firstUnfinishedIndex),
      })),
    };
  });
};

export default function RoadmapList() {
  const { data, isPending, isError, error } = useStudyChapters();

  const sections = data ? toSections(data.chapters, data.currentChapterId) : [];

  if (isPending) {
    return (
      <Placeholder>
        <ActivityIndicator color={colors.primary400} />
      </Placeholder>
    );
  }

  if (isError) {
    return (
      <Placeholder>
        <Message $isError>{getStudyChaptersErrorMessage(error)}</Message>
      </Placeholder>
    );
  }

  if (sections.length === 0) {
    return (
      <Placeholder>
        <Message>아직 학습할 수 있는 단원이 없어요.</Message>
      </Placeholder>
    );
  }

  return (
    <Wrapper
      contentContainerStyle={{ paddingTop: 0 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
    >
      {sections.map(({ chapter, steps }) => (
        <Section key={chapter.chapterId}>
          <ChapterTitle
            title={chapter.title}
            description={chapter.description}
            isCurrent={chapter.chapterId === data?.currentChapterId}
          />

          {steps.map((step, index) => (
            <RoadmapStep
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
              onPress={() =>
                router.push({
                  pathname: "/study/Study",
                  params: { wordIndex: "0", lessonId: String(step.id) },
                })
              }
            />
          ))}
        </Section>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const Placeholder = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Message = styled.Text<{ $isError?: boolean }>`
  color: ${({ $isError }) => ($isError ? colors.errorRed : colors.neutral600)};
  font-size: 14px;
  text-align: center;
`;
