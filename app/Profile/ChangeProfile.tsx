import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import ProfileHeader from "@/components/header/ProfileHeader";
import { Profile } from "@/components/Signup";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function ChangeProfile() {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const isActive = name.length > 0;

  const handleChangeProfile = () => {
    setErrorMessage("");
    router.replace("/Profile/Profile");
  };

  const onChangeName = (text: string) => {
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
          <ProfileHeader title="프로필 변경" />

          <TitleWrapper>
            <LineText>
              내 <Name>프로필</Name>을 최신 정보로 {"\n"}
              수정해보세요
            </LineText>{" "}
          </TitleWrapper>

          <Wrapper>
            <Center>
              <Profile />

              <InputWrapper>
                <Input
                  placeholder="새로운 이름을 입력해주세요"
                  type="text"
                  onChangeText={onChangeName}
                  value={name}
                />
                <SubText>
                  설정한 이름은 추후에도 자유롭게 변경할 수 있습니다.
                </SubText>
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              </InputWrapper>
            </Center>

            <AuthButton
              text="확인"
              isActive={isActive}
              onPress={handleChangeProfile}
            />
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
