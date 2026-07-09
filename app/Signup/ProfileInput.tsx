import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import Question from "@/components/auth/Question";
import { BackIcon, Profile } from "@/components/Signup";
import { colors } from "@/constants/colors";
import { useSignupStore } from "@/stores/signupStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

export default function ProfileInput() {
  const [isActive, setIsActive] = useState(false);
  const { name, setName, reset } = useSignupStore();

  const Signup = () => {
    reset();
    router.push("/Login");
  };

  const InputId = (text: string) => {
    setName(text.replace(/\s/g, ""));
  };

  useEffect(() => {
    if (name) {
      setIsActive(true);
      return;
    }
    setIsActive(false);
  }, [name]);

  return (
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
            </InputWrapper>
          </Center>

          <View>
            <AuthButton text="회원가입" isActive={isActive} onPress={Signup} />
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
