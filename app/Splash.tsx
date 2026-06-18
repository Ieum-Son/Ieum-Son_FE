import Blue from "@/assets/Logo/Blue.png";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

export default function Splash() {
  return (
    <Container>
      <Image source={Blue} resizeMode="contain" />
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
