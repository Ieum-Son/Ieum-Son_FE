import { AuthButton, ModifyButton, Question } from "@/components/auth/index";
import { CodeInput, Input } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

  const InputEmail = (text: string) => {
    setEmail(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <Container>
        <IconWrapper>
          <Icon>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </Icon>
        </IconWrapper>

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
                onChangeText={setCode}
              />
            )}
          </InputWrapperWrapper>
          <View>
            <AuthButton text="다음" isActive={isActive} />
            <Question question="계정이 있으신가요?" button="로그인" />
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

const IconWrapper = styled.View`
  display: flex;
  width: 100%;
  padding: 18px 12px;
  align-items: center;
  gap: 10px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 93%;
`;

const Icon = styled.Text`
  width: 6px;
  height: 12px;
  padding: 18px 12px;
`;

const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
