import { colors } from "@/constants/colors";
import { Image } from "expo-image";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface TabEachProps {
  img: ImageSourcePropType;
  text: string;
  isActive: boolean;
}

export default function TabEach({ img, text, isActive }: TabEachProps) {
  return (
    <>
      <Wrapper $isActive={isActive}>
        <Icon source={img} contentFit="contain" />
        <Title $isActive={isActive}>{text}</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.View<{ $isActive: boolean }>`
  height: 60px;
  flex: 1;
  padding: 6px 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isActive }) =>
    $isActive ? colors.primary50 : "transparent"};
  border-radius: 50px;
`;

const Icon = styled(Image)`
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
`;

const Title = styled.Text<{ $isActive: boolean }>`
  font-size: 16px;
  color: ${({ $isActive }) =>
    $isActive ? colors.primary300 : colors.neutral600};
`;
