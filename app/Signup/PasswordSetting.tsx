import {
  CodeInput,
  ErrorText,
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
import { useState } from "react";
import styled from "styled-components/native";

interface InputWrapperProps {
  isDuplication?: boolean;
}

export default function PasswordSetting() {
  const [isDuplication, setIsDuplication] = useState(false);
  const [isLengthFull, setIsLengthFull] = useState(true);
  const { password, setPassword } = useSignupForm();
  const [rePassword, setRePassword] = useState("");
  const isActive = password.length > 0 && rePassword.length > 0;

  const onPress = () => {
    setIsLengthFull(true);
    setIsDuplication(false);
    if (password.length < 8) {
      setIsLengthFull(false);
      return;
    } else if (password !== rePassword) {
      setIsDuplication(true);
      return;
    }
    router.push("/Signup/ProfileInput");
  };

  const InputPassword = (text: string) => {
    setPassword(removeSpaces(text));
    setIsLengthFull(true);
    setIsDuplication(false);
  };

  const InputRePassword = (text: string) => {
    setRePassword(removeSpaces(text));
    setIsLengthFull(true);
    setIsDuplication(false);
  };

  return (
    <SignupScreen keyboardAvoidingStyle={{ flexGrow: 1 }}>
      <TitleWrapper>
        <LineText>비밀번호를 설정해 주세요</LineText>
      </TitleWrapper>

      <Wrapper>
        <InputWrapperWrapper>
          <InputWrapper>
            <CodeInput
              placeholder="비밀번호를 입력해주세요."
              type="password"
              onChangeText={InputPassword}
              value={password}
            />
          </InputWrapper>

          <InputWrapper isDuplication={isDuplication}>
            <CodeInput
              placeholder="비밀번호를 다시 입력해주세요."
              type="password"
              onChangeText={InputRePassword}
              value={rePassword}
            />
          </InputWrapper>
          {!isLengthFull ? (
            <ErrorText spaced>8자 이상 입력해주세요.</ErrorText>
          ) : isDuplication ? (
            <ErrorText spaced>비밀번호가 일치하지 않습니다.</ErrorText>
          ) : null}
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
  align-items: flex-start;
  width: 93%;
  display: flex;
  gap: 4px;
  border-width: 1px;
  border-color: ${({ isDuplication }) =>
    isDuplication ? colors.errorRed : "white"};
  border-radius: 12px;
`;
