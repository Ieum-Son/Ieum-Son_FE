import { Image } from "expo-image";
import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export default function Profile({}) {
  return (
    <>
      <Wrapper>
        <UserProfile
          source={require("@/assets/user/defaultProfile.png")}
        ></UserProfile>
        <Overlay />
        <Camera source={require("@/assets/user/camera.svg")}></Camera>
      </Wrapper>
    </>
  );
}

const Overlay = styled.View`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Wrapper = styled(Pressable)`
  width: 120px;
  height: 120px;
  position: relative;
`;

const UserProfile = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 100px;
`;

const Camera = styled(Image)`
  width: 48px;
  height: 48px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-24px, -24px);
`;
