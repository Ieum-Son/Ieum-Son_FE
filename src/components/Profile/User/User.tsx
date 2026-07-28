import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

export default function User() {
  return (
    <Wrapper>
      <Profile source={require("@/assets/user/defaultProfile.png")}></Profile>
      <Info>
        <Name>사용자명</Name>
        <Email>mare2mare6@gmail.com</Email>
      </Info>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 16px;
  padding: 8px 20px;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

const Info = styled.View`
  flex-direction: column;
  gap: -2px;
`;

const Profile = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 999px;
`;

const Name = styled.Text`
  color: #000;
  font-size: 24px;
  font-weight: 700;
`;

const Email = styled.Text`
  color: ${colors.neutral600};
  font-size: 14px;
  font-weight: 400;
`;
