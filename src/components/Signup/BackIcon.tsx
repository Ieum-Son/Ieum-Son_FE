import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import styled from "styled-components/native";

export default function BackIcon() {
  return (
    <IconButton onPress={() => router.back()}>
      <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
    </IconButton>
  );
}

const IconButton = styled.Pressable`
  padding: 12px 20px;
  align-self: flex-start;
`;
