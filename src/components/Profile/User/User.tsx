import { colors } from "@/constants/colors";
import { useUserInfo } from "@/hooks/UserInfo";
import { useUserStore } from "@/stores/userStore";
import React from "react";
import styled from "styled-components/native";

export default function User() {
  const name = useUserStore((state) => state.user?.name);
  const profileImageUrl = useUserStore((state) => state.user?.profileImageUrl);
  const { data: userInfo } = useUserInfo();
  const profileSource = profileImageUrl
    ? { uri: profileImageUrl }
    : require("@/assets/user/defaultProfile.png");

  return (
    <Wrapper>
      <Profile source={profileSource} />
      <Info>
        <Name>{name || "사용자명 정보 없음"}</Name>
        <Email>{userInfo?.email || "이메일 정보 없음"}</Email>
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
  gap: 0px;
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
