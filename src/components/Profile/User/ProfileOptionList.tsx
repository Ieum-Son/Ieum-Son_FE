import type { ReactNode } from "react";
import { router, type Href } from "expo-router";
import styled from "styled-components/native";
import ProfileOption from "./ProfileOption";

const PROFILE_OPTIONS = [
  { content: "프로필 수정", href: "/Profile/ChangeProfile" },
  { content: "스트릭 사용처 조회", href: "/Profile/StreakHistoryPage" },
  { content: "즐겨찾기한 단어", href: "/Profile/FavoritesWords" },
  { content: "설정", href: "/Profile/Setting" },
] satisfies {
  content: string;
  href: Href;
}[];

interface ProfileOptionListProps {
  children?: ReactNode;
}

export default function ProfileOptionList({
  children,
}: ProfileOptionListProps) {
  return (
    <Wrapper>
      {PROFILE_OPTIONS.map((option) => {
        return (
          <ProfileOption
            key={option.content}
            content={option.content}
            onPress={
              option.href ? () => router.push(option.href as Href) : undefined
            }
          />
        );
      })}
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  padding: 16px 20px 10px;
`;
