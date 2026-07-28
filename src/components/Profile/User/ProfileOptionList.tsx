import React from "react";
import { router, type Href } from "expo-router";
import styled from "styled-components/native";
import ProfileOption from "./ProfileOption";

const PROFILE_OPTIONS = [
  { content: "프로필 수정", href: "/Profile/ChangeProfile" },
  { content: "스트릭 사용처 조회", href: "/Profile/StreakHistoryPage" },
  { content: "즐겨찾기한 단어", href: "/Profile/FavoritesWords" },
  { content: "설정", href: "/Profile/Setting" },
  { content: "로그아웃", destructive: true },
  { content: "회원탈퇴", destructive: true },
] satisfies {
  content: string;
  href?: Href;
  destructive?: boolean;
}[];

export default function ProfileOptionList() {
  return (
    <Wrapper>
      {PROFILE_OPTIONS.map((option) => (
        <ProfileOption
          key={option.content}
          content={option.content}
          destructive={option.destructive}
          onPress={
            option.href ? () => router.push(option.href as Href) : undefined
          }
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  padding: 16px 20px 10px;
`;
