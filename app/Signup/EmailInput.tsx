import { AuthButton, ModifyButton, Question } from "@/components/auth/index";
import { BackIcon, CodeInput, Input } from "@/components/Signup/index";
import VerifyTimer from "@/components/Signup/VerifyTimer";
import { colors } from "@/constants/colors";
import type { ErrorResponse } from "@/hooks/auth/errorResponse";
import { useVerifyCode, useVerifyEmail } from "@/hooks/auth/useSignup";
import { useTimer } from "@/hooks/useTimer";
import { useSignupStore } from "@/stores/signupStore";
import { isValidEmail } from "@/utils/isValidEmail";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError<ErrorResponse>(error)) {
    return fallback;
  }

  return error.response?.data?.message ?? fallback;
};

export default function EmailInput() {
  const verifyEmailMutation = useVerifyEmail();
  const verifyCodeMutation = useVerifyCode();
  const { email, setEmail } = useSignupStore();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const { formattedTime, isExpired, startTimer } = useTimer();
  const isModifyActive =
    isValidEmail(email) && !verifyEmailMutation.isPending;
  const isNextActive =
    isCodeSent &&
    /^\d{6}$/.test(code) &&
    !isExpired &&
    !verifyCodeMutation.isPending;

  useEffect(() => {
    setCode("");
    setIsCodeSent(false);
    setVerifiedEmail(null);
    setIsError(false);
    setErrorMessage("");
  }, [email]);

  const InputCode = (text: string) => {
    setCode(text.replace(/\D/g, "").slice(0, 6));
    setErrorMessage("");
    setIsError(false);
  };

  const modify = async () => {
    if (!isValidEmail(email)) {
      setIsError(true);
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const requestedEmail = email;

    try {
      await verifyEmailMutation.mutateAsync({ email: requestedEmail });

      if (useSignupStore.getState().email !== requestedEmail) {
        return;
      }

      setIsError(false);
      setErrorMessage("");
      setCode("");
      setIsCodeSent(true);
      setVerifiedEmail(requestedEmail);
      startTimer();
    } catch (error) {
      setIsError(true);
      setErrorMessage(
        getErrorMessage(error, "인증 메일 전송에 실패했습니다."),
      );
    }
  };

  const handleNext = async () => {
    if (!verifiedEmail || verifiedEmail !== email) {
      setErrorMessage("현재 이메일로 다시 인증해주세요.");
      return;
    }

    if (isExpired) {
      setErrorMessage("인증 시간이 만료되었습니다. 다시 인증해주세요.");
      return;
    }

    try {
      await verifyCodeMutation.mutateAsync({ email: verifiedEmail, code });
      setErrorMessage("");
      router.push("/Signup/IdSetting");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "인증 코드가 올바르지 않거나 만료되었습니다."),
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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
                    disabled={isCodeSent && !isExpired}
                    onPress={modify}
                  />
                </InputWrapper>

                {isError && !isCodeSent && (
                  <ErrorText>{errorMessage}</ErrorText>
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
              <AuthButton
                text="다음"
                isActive={isNextActive}
                onPress={handleNext}
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
    </SafeAreaView>
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
