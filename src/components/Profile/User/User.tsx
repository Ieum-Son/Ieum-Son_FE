import { colors } from "@/constants/colors";
import { useUserStore } from "@/stores/userStore";
import React from "react";
import styled from "styled-components/native";

export default function User() {
  const user = useUserStore((state) => state.user);
  const profileSource = user?.profileImageUrl
    ? { uri: user.profileImageUrl }
    : require("@/assets/user/defaultProfile.png");

  return (
    <Wrapper>
      <Profile source={profileSource} />
      <Info>
        <Name>{user?.name || "사용자명"}</Name>
        <Email>{user?.email || user?.loginId || "이메일 정보 없음"}</Email>
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
