import QueryState from "@/components/common/QueryState";
import { colors } from "@/constants/colors";
import {
  getDailyProgressErrorMessage,
  useDailyProgress,
} from "@/hooks/progress";
import React from "react";
import { default as styled } from "styled-components/native";

export default function TodayLearning() {
  const {
    data: daily,
    isPending,
    isPaused,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDailyProgress();

  if (isPending || isError) {
    return (
      <QueryState
        isPending={isPending}
        isPaused={isPaused}
        isError={isError}
        message={isError ? getDailyProgressErrorMessage(error) : undefined}
        isRetrying={isRefetching}
        onRetry={() => refetch()}
      />
    );
  }

  const { progress, words } = daily;

  return (
    <Wrapper>
      <Title>DAY {daily.streakCount}</Title>
      <Description>
        {daily.completed
          ? "오늘 학습을 모두 마쳤어요. 내일도 이어가 볼까요?"
          : `단어 ${progress.wordsCompleted}/${progress.wordsTotal}, 문장 ${progress.sentencesCompleted}/${progress.sentencesTotal}을 마쳤어요.`}
      </Description>

      {words.length === 0 ? (
        <WordList>
          <Word>오늘 배정된 단어가 없어요.</Word>
        </WordList>
      ) : (
        <WordList>
          {words.map((word, index) => (
            <Word key={word.wordId} $isMastered={word.isMastered}>
              {index + 1}. {word.word}
            </Word>
          ))}
        </WordList>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: ${colors.primary600};
  font-size: 24px;
  font-weight: 700;
`;

const Description = styled.Text`
  color: ${colors.neutral600};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`;

const WordList = styled.View`
  margin-top: 24px;
  padding: 15px 15px;
  gap: 11px;
  border-radius: 8px;
  background-color: ${colors.neutral100};
`;

const Word = styled.Text<{ $isMastered?: boolean }>`
  color: ${({ $isMastered }) =>
    $isMastered ? colors.primary400 : colors.neutral1000};
  font-size: 16px;
  font-weight: 600;
`;
