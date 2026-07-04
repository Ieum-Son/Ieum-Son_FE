import { colors } from "@/constants/colors";
import styled from "styled-components/native";

export default function SignupButton() {
  return (
    <Wrapper>
      <ButtonText>회원가입</ButtonText>
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity`
  height: 48px;
  width: 353px;
  border-radius: 12px;
  background-color: ${colors.primary300};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;
