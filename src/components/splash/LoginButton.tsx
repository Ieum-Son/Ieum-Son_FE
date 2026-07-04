import { colors } from "@/constants/colors";
import styled from "styled-components/native";

export default function LoginButton() {
  return (
    <Wrapper>
      <ButtonText>로그인</ButtonText>
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity`
  height: 48px;
  width: 353px;
  border-radius: 12px;
  border: 1px solid ${colors.primary300};
  background-color: white;
  color: ${colors.primary300};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${colors.primary300};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;
