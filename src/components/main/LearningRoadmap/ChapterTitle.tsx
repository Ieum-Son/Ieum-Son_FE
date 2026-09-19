import { colors } from "@/constants/colors";
import React from "react";
import { default as styled } from "styled-components/native";

interface ChapterTitleProps {
  title: string;
  description: string;
  isCurrent?: boolean;
}

export default function ChapterTitle({
  title,
  description,
  isCurrent,
}: ChapterTitleProps) {
  return (
    <Wrapper>
      <TitleRow>
        <Title $isCurrent={isCurrent} numberOfLines={1}>
          {title}
        </Title>
        {isCurrent && (
          <CurrentBadge>
            <CurrentBadgeText>학습중</CurrentBadgeText>
          </CurrentBadge>
        )}
      </TitleRow>
      <Description numberOfLines={2}>{description}</Description>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 2px;
  margin-bottom: 12px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Title = styled.Text<{ $isCurrent?: boolean }>`
  flex-shrink: 1;
  color: ${({ $isCurrent }) =>
    $isCurrent ? colors.primary600 : colors.neutral800};
  font-size: 18px;
  font-weight: 700;
`;

const CurrentBadge = styled.View`
  padding: 3px 10px;
  border-radius: 999px;
  background-color: ${colors.primary100};
`;

const CurrentBadgeText = styled.Text`
  color: ${colors.primary400};
  font-size: 11px;
  font-weight: 600;
`;

const Description = styled.Text`
  color: ${colors.neutral500};
  font-size: 13px;
  line-height: 20px;
`;
