import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface AuthButtonProps {
  isActive: true | false;
  text: string;
  onPress?: () => void;
}

export default function AuthButton({
  text,
  isActive,
  onPress,
}: AuthButtonProps) {
  return (
    <Wrapper isActive={isActive} disabled={!isActive} onPress={onPress}>
      <ButtonText>{text}</ButtonText>
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity<Omit<AuthButtonProps, "text">>`
  height: 48px;
  width: 353px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isActive }) =>
    isActive ? colors.primary300 : colors.neutral400};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;
