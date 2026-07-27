import Blue from "@/assets/Logo/Blue.png";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Profile/ChangeProfile");
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
