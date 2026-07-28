import React from "react";
import styled from "styled-components/native";
import StreakBlock from "./StreakBlock";

export default function StreakHistoryList() {
  return (
    <Wrapper
      contentContainerStyle={{
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
      <StreakBlock text="스트릭 복구" date="2026.07.25" useCoin={40} />
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  padding: 0px 20px;
  margin-top: 6px;
`;
