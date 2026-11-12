import Input from "@/components/auth/LoginInput";
import {
  ErrorText,
  LineText,
  Profile,
  SignupFooter,
  SignupScreen,
  TitleWrapper,
  Wrapper,
} from "@/components/Signup/index";
import { colors } from "@/constants/colors";
import { useSignupForm } from "@/contexts/SignupContext";
import { getSignupErrorMessage, useSignup } from "@/hooks/auth/useSignup";
import { removeSpaces } from "@/utils/removeSpaces";
import { validateProfileImage } from "@/utils/validateProfileImage";
import { useState } from "react";
import styled from "styled-components/native";

export default function ProfileInput() {
  const { mutate: submitSignup, isPending } = useSignup();
  const { name, profile, setName, setProfile, getSignupPayload } =
    useSignupForm();
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

    const imageError = validateProfileImage(signupPayload.image);

    if (imageError) {
      setErrorMessage(imageError);
      return;
    }

    submitSignup(signupPayload, {
      onError: (error) => setErrorMessage(getSignupErrorMessage(error)),
    });
  };

  const InputId = (text: string) => {
    setName(removeSpaces(text));
    setErrorMessage("");
  };

  return (
    <SignupScreen keyboardAvoidingStyle={{ flexGrow: 1 }}>
      <TitleWrapper>
        <LineText>
          이제 마지막 단계에요 {"\n"}
          나만의 <Name>프로필</Name>을 만들어보세요
        </LineText>
      </TitleWrapper>

      <Wrapper>
        <Center>
          <Profile value={profile} onChange={setProfile} />

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

        <SignupFooter
          text="회원가입"
          isActive={isActive}
          onPress={handleSignup}
          isLoading={isPending}
          loadingText="가입 중..."
        />
      </Wrapper>
    </SignupScreen>
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

const InputWrapper = styled.View``;

const Name = styled.Text`
  color: ${colors.primary400};
  font-size: 28px;
  font-weight: 700;
`;
