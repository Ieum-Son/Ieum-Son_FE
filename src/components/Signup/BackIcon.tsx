import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import styled from "styled-components/native";

interface BackIconProps {
  onPress?: () => void;
}

export default function BackIcon({ onPress }: BackIconProps) {
  return (
    <IconButton
      onPress={onPress ?? (() => router.back())}
      accessibilityRole="button"
      accessibilityLabel="이전 화면으로 이동"
    >
      <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
    </IconButton>
  );
}

const IconButton = styled.Pressable`
  padding: 12px 20px;
  align-self: flex-start;
`;
