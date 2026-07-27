import { BackIcon } from "@/components/Signup";
import React from "react";
import styled from "styled-components/native";

interface ProfileHeaderProps {
  title: string;
}

export default function ProfileHeader({ title }: ProfileHeaderProps) {
  return (
    <Top>
      <BackIcon />
      <Title pointerEvents="none">{title}</Title>
    </Top>
  );
}

const Top = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;
