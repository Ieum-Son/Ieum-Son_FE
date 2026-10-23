import type { LessonWord } from "@/apis/study/type";
import ProfileHeader from "@/components/header/ProfileHeader";
import StudyStateScreen from "@/components/Study/StudyStateScreen";
import WordVideoModal from "@/components/WordVideoModal";
import { colors } from "@/constants/colors";
import { getStudyLessonErrorMessage, useStudyLesson } from "@/hooks/Study";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const LESSON_TITLE = "레슨";

export default function Lesson() {
  const { lessonId: lessonIdParam } = useLocalSearchParams<{
    lessonId?: string;
  }>();
  const lessonId = Number(lessonIdParam);
  const [playingWord, setPlayingWord] = useState<LessonWord | null>(null);
  const {
    data: lesson,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useStudyLesson(lessonId);

  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    return (
      <StudyStateScreen
        title={LESSON_TITLE}
        message="레슨 정보를 찾을 수 없어요."
        isError
      />
    );
  }

  if (isPending) return <StudyStateScreen title={LESSON_TITLE} />;

  if (isError) {
    return (
      <StudyStateScreen
        title={LESSON_TITLE}
        message={getStudyLessonErrorMessage(error)}
        isError
        isRetrying={isRefetching}
        onRetry={() => refetch()}
      />
    );
  }

  const masteredCount = lesson.words.filter((word) => word.isMastered).length;

  return (
    <Screen edges={["top", "bottom"]}>
      <ProfileHeader title={LESSON_TITLE} />

      <Content
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Summary>
          <Name selectable>{lesson.name}</Name>
          <Description selectable>{lesson.description}</Description>
          <Progress selectable>
            {`${lesson.words.length}단어 중 ${masteredCount}단어 마스터`}
          </Progress>
        </Summary>

        {lesson.words.length === 0 ? (
          <Empty>이 레슨에는 아직 단어가 없어요.</Empty>
        ) : (
          lesson.words.map((word) => (
            <WordCard
              key={word.wordId}
              onPress={() => setPlayingWord(word)}
              accessibilityRole="button"
              accessibilityLabel={`${word.word} 영상 보기${word.isMastered ? ", 마스터함" : ""}`}
            >
              <WordInfo>
                <WordTop>
                  <Category>{word.category}</Category>
                  {word.isMastered ? <Mastered>마스터</Mastered> : null}
                </WordTop>
                <Word>{word.word}</Word>
                <Definition numberOfLines={2}>{word.definition}</Definition>
              </WordInfo>
              <MaterialIcons
                name="play-circle-outline"
                size={28}
                color={colors.primary400}
              />
            </WordCard>
          ))
        )}
      </Content>

      {playingWord ? (
        <WordVideoModal
          word={playingWord.word}
          videoUrl={playingWord.videoUrl}
          onClose={() => setPlayingWord(null)}
        />
      ) : null}
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 0 20px;
`;

const Summary = styled.View`
  gap: 6px;
  padding: 12px 0 20px;
`;

const Name = styled.Text`
  color: ${colors.neutral1000};
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
`;

const Description = styled.Text`
  color: ${colors.neutral600};
  font-size: 14px;
  line-height: 22px;
`;

const Progress = styled.Text`
  margin-top: 2px;
  color: ${colors.primary400};
  font-size: 14px;
  font-weight: 600;
`;

const WordCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid ${colors.neutral100};
  background-color: ${colors.neutral50};
`;

const WordInfo = styled.View`
  flex: 1;
  gap: 2px;
`;

const WordTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const Category = styled.Text`
  align-self: flex-start;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${colors.primary400};
  background-color: ${colors.primary100};
  border-radius: 999px;
`;

const Mastered = styled.Text`
  align-self: flex-start;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${colors.successGreen};
  background-color: ${colors.neutral100};
  border-radius: 999px;
`;

const Word = styled.Text`
  color: ${colors.neutral1000};
  font-size: 18px;
  font-weight: 700;
`;

const Definition = styled.Text`
  color: ${colors.neutral600};
  font-size: 14px;
  line-height: 22px;
`;

const Empty = styled.Text`
  margin-top: 40px;
  color: ${colors.neutral600};
  font-size: 14px;
  text-align: center;
`;
