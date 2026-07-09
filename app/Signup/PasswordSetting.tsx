import { AuthButton, Question } from "@/components/auth/index";
import { BackIcon, CodeInput } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { useSignupStore } from "@/stores/signupStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

interface InputWrapperProps {
  isDuplication?: boolean;
}

export default function PasswordSetting() {
  const [isActive, setIsActive] = useState(false);
  const [isDuplication, setIsDuplication] = useState(false);
  const [isLengthFull, setIsLengthFull] = useState(true);
  const { password, setPassword } = useSignupStore();
  const [rePassword, setRePassword] = useState("");

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

  useEffect(() => {
    setIsActive(!!(password && rePassword));
  }, [password, rePassword]);

  const InputPassword = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
    setIsLengthFull(true);
    setIsDuplication(false);
  };

  const InputRePassword = (text: string) => {
    setRePassword(text.replace(/\s/g, ""));
    setIsLengthFull(true);
    setIsDuplication(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <Container>
        <BackIcon />

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
              <ErrorText>8자 이상 입력해주세요.</ErrorText>
            ) : isDuplication ? (
              <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
            ) : null}
          </InputWrapperWrapper>

          <View>
            <AuthButton text="다음" isActive={isActive} onPress={onPress} />
            <Question
              question="계정이 있으신가요?"
              button="로그인"
              onPress={() => router.push("/Login")}
            />
          </View>
        </Wrapper>
      </Container>
    </KeyboardAvoidingView>
  );
}

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.2px;
`;

const InputWrapperWrapper = styled.View`
  display: flex;
  gap: 16px;
  display: flex;
  gap: 4px;
`;

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const Wrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
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

const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
