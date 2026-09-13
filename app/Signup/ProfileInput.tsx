import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import Question from "@/components/auth/Question";
import { BackIcon, Profile } from "@/components/Signup";
import { colors } from "@/constants/colors";
import { getSignupErrorMessage, useSignup } from "@/hooks/auth/useSignup";
import { useSignupStore } from "@/stores/signupStore";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const ALLOWED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_PROFILE_IMAGE_SIZE = 50 * 1024 * 1024;

export default function ProfileInput() {
  const { mutate: submitSignup, isPending } = useSignup();
  const { name, profile, setName, getSignupPayload } = useSignupStore();
  const [errorMessage, setErrorMessage] = useState("");
  const isActive = name.length > 0 && profile !== null && !isPending;

  const handleSignup = () => {
    setErrorMessage("");
    const signupPayload = getSignupPayload();

    if (!signupPayload) {
      setErrorMessage(
        profile
          ? "회원가입 정보를 다시 확인해주세요."
          : "프로필 이미지를 업로드해주세요.",
      );
      return;
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(signupPayload.image.type)) {
      setErrorMessage("지원하지 않는 이미지 형식입니다.");
      return;
    }

    if (
      signupPayload.image.size !== undefined &&
      signupPayload.image.size > MAX_PROFILE_IMAGE_SIZE
    ) {
      setErrorMessage("파일 크기는 50MB 이하이어야 합니다.");
      return;
    }

    submitSignup(signupPayload, {
      onError: (error) => setErrorMessage(getSignupErrorMessage(error)),
    });
  };

  const InputId = (text: string) => {
    setName(text.replace(/\s/g, ""));
    setErrorMessage("");
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
              이제 마지막 단계에요 {"\n"}
              나만의 <Name>프로필</Name>을 만들어보세요
            </LineText>
          </TitleWrapper>

          <Wrapper>
            <Center>
              <Profile />

              <InputWrapper>
                <Input
                  placeholder="이름을 입력해주세요"
                  type="text"
                  onChangeText={InputId}
                  value={name}
                />
                <SubText>
                  설정한 이름은 추후에도 자유롭게 변경할 수 있습니다.
                </SubText>
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              </InputWrapper>
            </Center>

            <View>
              <AuthButton
                text="회원가입"
                isActive={isActive}
                onPress={handleSignup}
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

const Center = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const SubText = styled.Text`
  color: ${colors.neutral500};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.2px;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
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

const InputWrapper = styled.View``;

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
