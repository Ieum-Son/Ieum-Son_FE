import { colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import React from "react";
import styled from "styled-components/native";
import SettingToggle from "./SettingToggle";

type SettingIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface SettingBlockProps {
  icon: SettingIconName;
  text: string;
  option: "next" | "toggle";
  value?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
}

export default function SettingBlock({
  icon,
  text,
  option,
  value = false,
  onPress,
  onValueChange,
}: SettingBlockProps) {
  return (
    <Wrapper>
      <Row
        accessibilityRole={option === "next" ? "button" : undefined}
        disabled={option !== "next" || !onPress}
        onPress={onPress}
      >
        <IconBox>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.primary300}
          />
        </IconBox>

        <Label>{text}</Label>

        {option === "next" ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.neutral1000}
          />
        ) : (
          <SettingToggle
            value={value}
            onValueChange={onValueChange}
          />
        )}
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 48px;
  padding: 0px 12px;
`;

const Row = styled.Pressable`
  height: 100%;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const IconBox = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: ${colors.primary100};
`;

const Label = styled.Text`
  flex: 1;
  color: black;
  font-size: 16px;
  font-weight: 400;
`;
