import { AuthButton, Question } from "@/components/auth/index";
import { Input } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

interface InputWrapperProps {
  isDuplication: boolean;
}

export default function IdSetting() {
  const [isActive, setIsActive] = useState(false);
  const [isDuplication, setIsDuplication] = useState(false);
  const [id, setId] = useState("");

  const onPress = () => {
    setIsDuplication(id === "에러아이디");
  };

  useEffect(() => {
    if (id.trim().length > 0) {
      setIsActive(true);
    } else if (id.trim().length == 0) {
      setIsActive(false);
    }
  }, [id]);

  const InputId = (text: string) => {
    setId(text);
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
          <LineText>서비스에서 사용할{"\n"}</LineText>
          <LineText>아이디를 입력해주세요</LineText>
        </TitleWrapper>

        <Wrapper>
          <InputWrapperWrapper>
            <InputWrapper isDuplication={isDuplication}>
              <Input
                placeholder="아이디를 입력해주세요."
                value={id}
                onChangeText={InputId}
              />
            </InputWrapper>
            {isDuplication && (
              <ErrorText>이미 사용중인 아이디입니다.</ErrorText>
            )}
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

const IconWrapper = styled.View`
  display: flex;
  width: 100%;
  padding: 18px 12px;
  align-items: center;
  gap: 10px;
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
