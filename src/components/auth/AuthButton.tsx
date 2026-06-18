import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface AuthButtonProps {
  isActive: true | false;
  text: string;
}

export default function AuthButton({ text, isActive }: AuthButtonProps) {
  return (
    <Wrapper isActive={isActive} disabled={!isActive}>
      <ButtonText>{text}</ButtonText>
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity<Pick<AuthButtonProps, "isActive">>`
  height: 48px;
  padding: 12px 32px;
  width: 353px;
  border-radius: 12px;
  align-items: center;
  text-align: center;
  background-color: ${(props) =>
    props.isActive ? colors.primary300 : colors.neutral400};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;
