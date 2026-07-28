import { colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import styled from "styled-components/native";

interface ProfileOptionProps {
  content: string;
  destructive?: boolean;
}

export default function ProfileOption({
  content,
  destructive = false,
}: ProfileOptionProps) {
  return (
    <Wrapper>
      <Content $destructive={destructive}>{content}</Content>

      {!destructive && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.neutral1000}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
`;

const Content = styled.Text<{ $destructive: boolean }>`
  color: ${({ $destructive }) =>
    $destructive ? colors.errorRed : colors.neutral1000};
  text-align: center;
  font-size: 16px;
  font-weight: 400;
`;
