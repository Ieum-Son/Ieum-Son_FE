import Blue from "@/assets/Logo/Blue.png";
import { LoginButton, SignupButton } from "@/components/splash/index";
import { Image } from "react-native";
import styled from "styled-components/native";

export default function Splash() {
  return (
    <Wrapper>
      <Container>
        <Image source={Blue} resizeMode="contain" />

        <ButtonWrapper>
          <SignupButton />
          <LoginButton />
        </ButtonWrapper>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 100%;
  justify-content: center;
`;

const Container = styled.View`
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonWrapper = styled.View`
  display: flex;
  gap: 15px;
  margin-bottom: -20px;
`;
