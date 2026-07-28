import { colors } from "@/constants/colors";
import type { ReactNode } from "react";
import React from "react";
import styled from "styled-components/native";

interface SettingSectionProps {
  title: string;
  topSpacing: number;
  children: ReactNode;
}

export default function SettingSection({
  title,
  topSpacing,
  children,
}: SettingSectionProps) {
  return (
    <Section $topSpacing={topSpacing}>
      <SectionTitle>{title}</SectionTitle>
      <BlockWrapper>{children}</BlockWrapper>
    </Section>
  );
}

const Section = styled.View<{ $topSpacing: number }>`
  margin: ${({ $topSpacing }) => $topSpacing}px 20px 0px;
`;

const SectionTitle = styled.Text`
  margin-bottom: 12px;
  color: ${colors.neutral600};
  font-size: 16px;
`;

const BlockWrapper = styled.View`
  padding: 16px 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  background-color: ${colors.neutral50};
`;
