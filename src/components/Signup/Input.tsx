import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface SignupInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
}

export default function Input({
  placeholder,
  onChangeText,
  value,
}: SignupInputProps) {
  return (
    <Container>
      <Wrapper
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  height: 48px;
  background-color: ${colors.neutral100};
  border-radius: 12px;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.TextInput`
  flex: 1;
`;
