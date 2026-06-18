import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface LoginInputProps {
  placeholder: string;
  type: "text" | "password";
  onChangeText: (text: string) => void;
  value: string;
}

export default function LoginInput({
  placeholder,
  type,
  onChangeText,
  value,
}: LoginInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Container>
      <Wrapper
        placeholder={placeholder}
        secureTextEntry={type === "password" && !isVisible}
        onChangeText={onChangeText}
        value={value}
      />
      {type === "password" && (
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Ionicons
            name={isVisible ? "eye" : "eye-off"}
            size={20}
            color={colors.neutral500}
          />
        </TouchableOpacity>
      )}
    </Container>
  );
}

const Container = styled.View`
  background-color: ${colors.neutral100};
  width: 353px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid ${colors.neutral100};
  padding: 0px 20px;
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.TextInput`
  flex: 1;
`;
