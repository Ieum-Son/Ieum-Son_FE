import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import styled from "styled-components/native";

export default function BackIcon() {
  return (
    <IconWrapper>
      <Icon onPress={() => router.back()}>
        <MaterialIcons
          name="arrow-back-ios"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
      </Icon>
    </IconWrapper>
  );
}

const IconWrapper = styled.View`
  display: flex;
  width: 100%;
  padding: 18px 12px;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.Text`
  width: 6px;
  height: 12px;
  padding: 18px 12px;
`;
