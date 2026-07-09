import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import Question from "@/components/auth/Question";
import Profile from "@/components/Signup/Profile";
import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

export default function ProfileInput() {
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState("");

  const InputId = (text: string) => {
    setId(text);
  };

  useEffect(() => {
    if (id.trim()) {
      setIsActive(true);
      return;
    }
    setIsActive(false);
  }, [id]);

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
                value={id}
              />
              <SubText>
                설정한 이름은 추후에도 자유롭게 변경할 수 있습니다.
              </SubText>
            </InputWrapper>
          </Center>

          <View>
            <AuthButton text="다음" isActive={isActive} />
            <Question question="계정이 있으신가요?" button="로그인" />
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

const IconWrapper = styled.View`
  display: flex;
  width: 100%;
  padding: 18px 12px;
  align-items: center;
  gap: 10px;
`;

const InputWrapper = styled.View``;

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
