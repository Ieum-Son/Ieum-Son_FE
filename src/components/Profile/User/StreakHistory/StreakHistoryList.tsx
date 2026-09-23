import { colors } from "@/constants/colors";
import {
  getGoldUseHistoryErrorMessage,
  isEarnedGold,
  useGoldUseHistory,
} from "@/hooks/goldUseHistory";
import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import StreakBlock from "./StreakBlock";

const formatUsedDate = (createdAt: string) => {
  if (!createdAt) return "-";

  return createdAt.slice(0, 10).replace(/-/g, ".");
};

export default function StreakHistoryList() {
  const { data, isPending, isError, error } = useGoldUseHistory();
  const items = data?.items ?? [];

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
        <Message $isError>{getGoldUseHistoryErrorMessage(error)}</Message>
      </Placeholder>
    );
  }

  if (items.length === 0) {
    return (
      <Placeholder>
        <Message>아직 금조각 내역이 없어요.</Message>
      </Placeholder>
    );
  }

  return (
    <Wrapper
      contentContainerStyle={{
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      {items.map((item) => (
        <StreakBlock
          key={item.id}
          text={item.description}
          date={formatUsedDate(item.createdAt)}
          useCoin={item.amount}
          isEarned={isEarnedGold(item.type)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  padding: 0px 20px;
  margin-top: 6px;
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
