import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface StreakBlockProps {
  text: string;
  date: string;
  useCoin: number;
}

export default function StreakBlock({ text, date, useCoin }: StreakBlockProps) {
  return (
    <Wrapper>
      <Top>
        <Text>{text}</Text>
        <Coin>-{useCoin}</Coin>
      </Top>
      <Day>{date}</Day>
    </Wrapper>
  );
}

const Coin = styled.Text`
  color: ${colors.primary400};
  font-size: 18px;
`;

const Wrapper = styled.View`
  display: flex;
  padding: 16px 20px;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 12px;
  height: 80px;
  background: ${colors.neutral50};
`;

const Day = styled.Text`
  color: ${colors.neutral600};
  font-size: 14px;
`;

const Text = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

const Top = styled.View`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
