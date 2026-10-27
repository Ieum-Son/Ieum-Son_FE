import Blue from "@/assets/Logo/Blue.png";
import { getAccessTokens } from "@/utils/tokenStorage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

const SPLASH_DURATION = 2000;

export default function Splash() {
  useEffect(() => {
    let mounted = true;

    const resolveEntry = async () => {
      const [token] = await Promise.all([
        getAccessTokens().catch(() => null),
        new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION)),
      ]);

      if (!mounted) return;

      router.replace(token ? "/Main" : "/Splash");
    };

    resolveEntry();

    return () => {
      mounted = false;
    };
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
