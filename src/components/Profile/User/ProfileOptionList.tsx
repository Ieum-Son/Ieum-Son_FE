import React from "react";
import styled from "styled-components/native";
import ProfileOption from "./ProfileOption";

const PROFILE_OPTIONS = [
  { content: "프로필 수정" },
  { content: "스트릭 사용처 조회" },
  { content: "즐겨찾기한 단어" },
  { content: "설정" },
  { content: "로그아웃", destructive: true },
  { content: "회원탈퇴", destructive: true },
];

export default function ProfileOptionList() {
  return (
    <Wrapper>
      {PROFILE_OPTIONS.map((option) => (
        <ProfileOption
          key={option.content}
          content={option.content}
          destructive={option.destructive}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  padding: 16px 20px 10px;
`;
