import BgImage from "@/assets/background/bg.png";
import Bluee from "@/assets/Logo/Blue";
import { LoginButton, SignupButton } from "@/components/splash";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import styled from "styled-components/native";

export default function Splash() {
  return (
    <Wrapper style={StyleSheet.absoluteFillObject}>
      <Image
        source={BgImage}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <Container>
        <Top>
          <Bluee />
          <SubText>매일 조금씩, 수화와 가까워지세요</SubText>
        </Top>

        <ButtonWrapper>
          <SignupButton onPress={() => router.push("/Signup/EmailInput")} />
          <LoginButton onPress={() => router.push("/Login")} />
        </ButtonWrapper>
      </Container>
    </Wrapper>
  );
}

const Top = styled.View`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 40px;
`;

const SubText = styled.Text`
  color: white;
  font-size: 15px;
`;

const Wrapper = styled(LinearGradient).attrs({
  colors: ["rgba(108,169,216)", "rgba(141,189,227)", "rgba(208,231,249)"],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  flex: 1;
`;
const Container = styled.View`
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 50px;
  flex: 1;

  align-items: center;
  justify-content: space-between;
`;
const ButtonWrapper = styled.View`
  gap: 15px;
`;
