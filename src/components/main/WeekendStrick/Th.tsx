import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

interface ThProps {
  day: string;
}

export default function Th({ day }: ThProps) {
  return (
    <Wrapper>
      <Content>{day}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  display: flex;
  flex: 1;
  max-width: 36px;
  aspect-ratio: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: ${colors.neutral200};
`;

const Content = styled.Text`
  color: ${colors.neutral400};
  font-size: 14px;
  font-weight: 400;
`;
