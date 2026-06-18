import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";

export default function Login() {
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const InputId = (text: string) => {
    setId(text);
  };
  const InputPassword = (text: string) => {
    setPassword(text);
  };

  useEffect(() => {
    if (id.trim() && password.trim()) {
      setIsActive(true);
      return;
    }
    setIsActive(false);
  }, [id, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <Container>
        <IconWrapper>
          <Icon>
            <MaterialIcons name="arrow-back-ios" size={12} color="black" />
          </Icon>
        </IconWrapper>

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

          <AuthButton text="로그인" isActive={isActive} />
        </Wrapper>
      </Container>
    </KeyboardAvoidingView>
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

const IconWrapper = styled.Text`
  display: flex;
  width: 100%;
  padding: 18px 12px;
  align-items: center;
  gap: 10px;
`;

const InputWrapper = styled.View`
  gap: 16px;
`;

const Icon = styled.Text`
  width: 6px;
  height: 12px;
  padding: 18px 12px;
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
