import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import Question from "@/components/auth/Question";
import { BackIcon } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Login() {
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const InputId = (text: string) => {
    setId(text.replace(/\s/g, ""));
  };
  const InputPassword = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
  };

  useEffect(() => {
    if (id && password) {
      setIsActive(true);
      return;
    }
    setIsActive(false);
  }, [id, password]);

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
                value={id}
              />
              <Input
                placeholder="비밀번호를 입력해주세요."
                type="password"
                onChangeText={InputPassword}
                value={password}
              />
            </InputWrapper>

            <View>
              <AuthButton text="로그인" isActive={isActive} />
              <Question
                question="계정이 없으신가요?"
                button="회원가입"
                onPress={() => router.push("/Signup/EmailInput")}
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
