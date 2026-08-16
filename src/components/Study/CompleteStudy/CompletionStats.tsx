import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface CompletionStatsProps {
  learnedWords: number;
  earnedGold: number;
}

export default function CompletionStats({
  learnedWords,
  earnedGold,
}: CompletionStatsProps) {
  return (
    <Wrapper>
      <StatCard
        accessible
        accessibilityLabel={`오늘 배운 단어 ${learnedWords}개`}
      >
        <Label>오늘 배운 단어</Label>
        <Value>+ {learnedWords}</Value>
      </StatCard>
      <StatCard
        accessible
        accessibilityLabel={`오늘 얻은 금조각 ${earnedGold}개`}
      >
        <Label>오늘 얻은 금조각</Label>
        <Value>+ {earnedGold}</Value>
      </StatCard>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 12px;
`;

const StatCard = styled.View`
  flex: 1;
  height: 68px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${colors.neutral100};
  padding: 12px 20px;
`;

const Label = styled.Text`
  color: ${colors.neutral700};
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`;

const Value = styled.Text`
  margin-top: 2px;
  color: ${colors.primary500};
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
`;
