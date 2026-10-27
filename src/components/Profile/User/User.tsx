import { colors } from "@/constants/colors";
import { getUserInfoErrorMessage, useUserInfo } from "@/hooks/UserInfo";
import { useUserStore } from "@/stores/userStore";
import React from "react";
import styled from "styled-components/native";

export default function User() {
  const name = useUserStore((state) => state.user?.name);
  const profileImageUrl = useUserStore((state) => state.user?.profileImageUrl);
  const { data: userInfo, error, refetch, isRefetching } = useUserInfo();
  const profileSource = profileImageUrl
    ? { uri: profileImageUrl }
    : require("@/assets/user/defaultProfile.png");

  return (
    <Wrapper>
      <Profile source={profileSource} />
      <Info>
        <Name>{name || "사용자명 정보 없음"}</Name>
        <Email>
          {error
            ? getUserInfoErrorMessage(error)
            : userInfo?.email || "이메일 정보 없음"}
        </Email>

        {error ? (
          <Retry
            onPress={() => refetch()}
            disabled={isRefetching}
            accessibilityRole="button"
            accessibilityLabel="내 정보 다시 불러오기"
          >
            <RetryText>다시 시도</RetryText>
          </Retry>
        ) : null}
      </Info>
    </Wrapper>
  );
}

const Retry = styled.Pressable`
  margin-top: 6px;
  padding: 6px 14px;
  align-self: flex-start;
  border-radius: 999px;
  background-color: ${colors.primary100};
`;

const RetryText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.primary400};
`;

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
