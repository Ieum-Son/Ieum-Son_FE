import { AuthButton, Question } from "@/components/auth/index";
import { BackIcon, Input } from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { useSignupStore } from "@/stores/signupStore";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

interface InputWrapperProps {
  isDuplication: boolean;
}

export default function IdSetting() {
  const { loginId, loginIdError, setLoginId } = useSignupStore();
  const isDuplication = Boolean(loginIdError);
  const isActive = loginId.length > 0 && !isDuplication;

  const onPress = () => {
    router.push("/Signup/PasswordSetting");
  };

  const InputId = (text: string) => {
    setLoginId(text.replace(/\s/g, ""));
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
            <LineText>서비스에서 사용할{"\n"}</LineText>
            <LineText>아이디를 입력해주세요</LineText>
          </TitleWrapper>

          <Wrapper>
            <InputWrapperWrapper>
              <InputWrapper isDuplication={isDuplication}>
                <Input
                  placeholder="아이디를 입력해주세요."
                  value={loginId}
                  onChangeText={InputId}
                />
              </InputWrapper>
              {loginIdError && <ErrorText>{loginIdError}</ErrorText>}
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
    </SafeAreaView>
  );
}

const InputWrapperWrapper = styled.View`
  display: flex;
  gap: 4px;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.2px;
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
  flex-direction: row;
  align-items: center;
  width: 93%;

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
