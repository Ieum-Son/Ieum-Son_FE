import {
  ErrorText,
  Input,
  LineText,
  SignupFooter,
  SignupScreen,
  TitleWrapper,
  Wrapper,
} from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { useSignupForm } from "@/contexts/SignupContext";
import { removeSpaces } from "@/utils/removeSpaces";
import { router } from "expo-router";
import styled from "styled-components/native";

interface InputWrapperProps {
  isDuplication: boolean;
}

export default function IdSetting() {
  const { loginId, loginIdError, setLoginId } = useSignupForm();
  const isDuplication = Boolean(loginIdError);
  const isActive = loginId.length > 0 && !isDuplication;

  const onPress = () => {
    router.push("/Signup/PasswordSetting");
  };

  const InputId = (text: string) => {
    setLoginId(removeSpaces(text));
  };

  return (
    <SignupScreen keyboardAvoidingStyle={{ flexGrow: 1 }}>
      <TitleWrapper>
        <LineText>서비스에서 사용할{"\n"}</LineText>
        <LineText>아이디를 입력해주세요</LineText>
      </TitleWrapper>

      <Wrapper>
        <InputWrapperWrapper>
          <InputWrapper isDuplication={isDuplication}>
            <Input
              placeholder="아이디를 입력해주세요."
              value={loginId}
              onChangeText={InputId}
            />
          </InputWrapper>
          {loginIdError && <ErrorText spaced>{loginIdError}</ErrorText>}
        </InputWrapperWrapper>
        <SignupFooter text="다음" isActive={isActive} onPress={onPress} />
      </Wrapper>
    </SignupScreen>
  );
}

const InputWrapperWrapper = styled.View`
  display: flex;
  gap: 4px;
`;

const InputWrapper = styled.View<InputWrapperProps>`
  flex-direction: row;
  align-items: center;
  width: 93%;

  border-width: 1px;
  border-color: ${({ isDuplication }) =>
    isDuplication ? colors.errorRed : "white"};
  border-radius: 12px;
`;
