import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface ProfileProps {
  profile: ImageSourcePropType;
}
export default function Profile({ profile }: ProfileProps) {
  return <Wrapper source={profile}></Wrapper>;
}

const Wrapper = styled.Image`
  width: 42px;
  height: 42px;
  border-radius: 100%;
`;
