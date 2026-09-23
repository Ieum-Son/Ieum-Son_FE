import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface StreakBlockProps {
  text: string;
  date: string;
  useCoin: number;
  isEarned?: boolean;
}

export default function StreakBlock({
  text,
  date,
  useCoin,
  isEarned = false,
}: StreakBlockProps) {
  return (
    <Wrapper>
      <Top>
        <Text numberOfLines={1}>{text}</Text>
        <Coin $isEarned={isEarned}>
          {isEarned ? "+" : "-"}
          {useCoin}
        </Coin>
      </Top>
      <Day>{date}</Day>
    </Wrapper>
  );
}

const Coin = styled.Text<{ $isEarned: boolean }>`
  color: ${({ $isEarned }) =>
    $isEarned ? colors.primary400 : colors.neutral700};
  font-size: 18px;
  font-weight: 600;
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
  flex: 1;
  margin-right: 12px;
  font-size: 18px;
  font-weight: 600;
`;

const Top = styled.View`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
