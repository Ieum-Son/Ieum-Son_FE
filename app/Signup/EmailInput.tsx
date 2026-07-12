import { AuthButton, ModifyButton, Question } from "@/components/auth/index";
import { BackIcon, CodeInput, Input } from "@/components/Signup/index";
import VerifyTimer from "@/components/Signup/VerifyTimer";
import { colors } from "@/constants/colors";
import { useTimer } from "@/hooks/useTimer";
import { useSignupStore } from "@/stores/signupStore";
import { isValidEmail } from "@/utils/isValidEmail";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

export default function EmailInput() {
  const [isActive, setIsActive] = useState(false);
  const { email, setEmail } = useSignupStore();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModifyActive, setIsModifyActive] = useState(false);
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const { formattedTime, isExpired, startTimer } = useTimer();

  useEffect(() => {
    setIsActive(code.trim().length === 6);
  }, [code]);

  useEffect(() => {
    setCode("");
    setIsActive(false);
    setIsCodeSent(false);
    setIsModifyActive(!!email);
    setIsError(false);
    setErrorMessage("");
  }, [email]);

  const InputCode = (text: string) => {
    setCode(text.replace(/\s/g, ""));
    setErrorMessage("");
    setIsError(false);
  };

  const modify = () => {
    if (!isValidEmail(email)) {
      setIsError(true);
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    setIsError(false);
    setErrorMessage("");
    setIsCodeSent(true);
    startTimer();
  };

  const handleNext = () => {
    if (isExpired) {
      setErrorMessage("시간 초과되었습니다. 다시 시도하세요");
      return;
    }

    router.push("/Signup/IdSetting");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <BackIcon />

        <TitleWrapper>
          <LineText>이메일을 입력해주세요</LineText>
        </TitleWrapper>

        <Wrapper>
          <InputWrapperWrapper>
            <EmailArea>
              <InputWrapper>
                <Input
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text.replace(/\s/g, ""));
                  }}
                />

                <ModifyButton
                  isActive={isModifyActive}
                  disabled={isCodeSent}
                  onPress={modify}
                />
              </InputWrapper>

              {isError && !isCodeSent && (
                <ErrorText>이메일 형식이 올바르지 않습니다.</ErrorText>
              )}
            </EmailArea>

            {isCodeSent && (
              <CodeArea>
                <CodeRow>
                  <CodeInputWrapper>
                    <CodeInput
                      placeholder="인증번호 6자리를 입력해주세요."
                      type="text"
                      value={code}
                      onChangeText={InputCode}
                    />
                  </CodeInputWrapper>

                  <VerifyTimer time={formattedTime} />
                </CodeRow>

                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              </CodeArea>
            )}
          </InputWrapperWrapper>

          <View>
            <AuthButton text="다음" isActive={isActive} onPress={handleNext} />

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

const EmailArea = styled.View`
  gap: 4px;
`;

const CodeArea = styled.View`
  width: 93%;
  gap: 6px;
`;

const CodeRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CodeInputWrapper = styled.View`
  flex: 1;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;

const InputWrapperWrapper = styled.View`
  width: 100%;
  gap: 16px;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 93%;
`;

const TitleWrapper = styled.View`
  margin: 30px 0 30px 15px;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
