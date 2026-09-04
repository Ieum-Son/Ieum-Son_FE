import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import Question from "@/components/auth/Question";
import { BackIcon } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { useLogin } from "@/hooks/auth/useLogin";
import type { ErrorResponse } from "@/hooks/errorResponse";
import { useSignupStore } from "@/stores/signupStore";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Login() {
  const loginMutation = useLogin();
  const resetSignup = useSignupStore((state) => state.reset);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isActive =
    loginId.length > 0 && password.length > 0 && !loginMutation.isPending;

  const InputId = (text: string) => {
    setLoginId(text.replace(/\s/g, ""));
    setErrorMessage("");
  };

  const InputPassword = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
    setErrorMessage("");
  };

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ loginId, password });
      setErrorMessage("");
      // main으로 이동 router
    } catch (error) {
      if (!isAxiosError<ErrorResponse>(error)) {
        setErrorMessage("로그인 정보를 저장하는 중 오류가 발생했습니다.");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ?? "로그인 중 오류가 발생했습니다.",
      );
    }
  };

  const handleSignup = () => {
    resetSignup();
    router.push("/Signup/EmailInput");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flexGrow: 1 }}
      >
        <Container>
          <BackIcon />

          <TitleWrapper>
            <LineText>
              <Name>이음손</Name>에 다시 {"\n"}
            </LineText>
            <LineText>오신 것을 환영해요!</LineText>
          </TitleWrapper>

          <Wrapper>
            <InputWrapper>
              <Input
                placeholder="아이디를 입력해주세요."
                type="text"
                onChangeText={InputId}
                value={loginId}
              />
              <Input
                placeholder="비밀번호를 입력해주세요."
                type="password"
                onChangeText={InputPassword}
                value={password}
              />
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </InputWrapper>

            <View>
              <AuthButton
                text="로그인"
                isActive={isActive}
                onPress={handleLogin}
              />
              <Question
                question="계정이 없으신가요?"
                button="회원가입"
                onPress={handleSignup}
              />
            </View>
          </Wrapper>
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  gap: 16px;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;

const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

const Name = styled.Text`
  color: ${colors.primary400};
  font-size: 28px;
  font-weight: 700;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
