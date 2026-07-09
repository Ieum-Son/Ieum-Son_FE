import { AuthButton, ModifyButton, Question } from "@/components/auth/index";
import { BackIcon, CodeInput, Input } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

export default function EmailInput() {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [isModifyActive, setIsModifyActive] = useState(false);
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    if (code.trim().length === 6) {
      setIsActive(true);
    } else setIsActive(false);
  }, [code]);

  useEffect(() => {
    setCode("");
    setIsActive(false);
    setIsCodeSent(false);
    if (email.trim()) {
      setIsModifyActive(true);
    } else {
      setIsModifyActive(false);
    }
  }, [email]);

  const InputCode = (text: string) => {
    setCode(text.replace(/\s/g, ""));
  };

  const InputEmail = (text: string) => {
    setEmail(text.replace(/\s/g, ""));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <BackIcon />
      <Container>
        <TitleWrapper>
          <LineText>이메일을 입력해주세요</LineText>
        </TitleWrapper>

        <Wrapper>
          <InputWrapperWrapper>
            <InputWrapper>
              <Input
                placeholder="이메일을 입력해주세요."
                value={email}
                onChangeText={InputEmail}
              />
              <ModifyButton
                isActive={isModifyActive}
                disabled={isCodeSent}
                onPress={() => setIsCodeSent(true)}
              />
            </InputWrapper>

            {isCodeSent && (
              <CodeInput
                placeholder="인증번호 6자리를 입력해주세요."
                type="text"
                value={code}
                onChangeText={InputCode}
              />
            )}
          </InputWrapperWrapper>
          <View>
            <AuthButton
              text="다음"
              isActive={isActive}
              onPress={() => router.push("/Signup/IdSetting")}
            />
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

const InputWrapperWrapper = styled.View`
  display: flex;
  gap: 16px;
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

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 93%;
`;

const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
