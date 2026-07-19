import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface ProfileProps {
  profile: ImageSourcePropType;
  width?: number;
  height?: number;
}

interface WrapperProps {
  $width: number;
  $height: number;
}

export default function Profile({
  profile,
  width = 42,
  height = 42,
}: ProfileProps) {
  return <Wrapper source={profile} $width={width} $height={height}></Wrapper>;
}

const Wrapper = styled.Image<WrapperProps>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: 100%;
`;
