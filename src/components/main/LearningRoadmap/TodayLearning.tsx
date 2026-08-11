import { colors } from "@/constants/colors";
import React from "react";
import { default as styled } from "styled-components/native";

const LEARNING_WORDS = ["학습 단어 1", "학습 단어 2", "학습 단어 3"];

export default function TodayLearning() {
  return (
    <Wrapper>
      <Title>DAY 1</Title>
      <Description>
        자세한 설명을 적습니다. 전에는 한줄만 보였던 거 여기는 다 나온다고
        보면 됩니다. 아마 네줄정도가 좋을 것 같아요.
      </Description>

      <WordList>
        {LEARNING_WORDS.map((word, index) => (
          <Word key={word}>
            {index + 1}. {word}
          </Word>
        ))}
      </WordList>
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

const Word = styled.Text`
  color: ${colors.neutral1000};
  font-size: 16px;
  font-weight: 600;
`;
