import { colors } from "@/constants/colors";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import Profile from "../Profile";

export interface UserCardProps {
  ranking: number;
  profile: ImageSourcePropType;
  name: string;
  coin: number;
  isMe?: boolean;
}

export default function UserCard({
  ranking,
  profile,
  name,
  coin,
  isMe = false,
}: UserCardProps) {
  return (
    <Wrapper $isMe={isMe}>
      <Left>
        <Rank $isMe={isMe}>{ranking}</Rank>

        <Center>
          <Profile profile={profile} />
          <Name $isMe={isMe}>{isMe ? `(나) ${name}` : name}</Name>
        </Center>
      </Left>
      <Right>
        <CoinImg
          source={
            isMe
              ? require("@/assets/user/CoinBlue.png")
              : require("@/assets/user/coin.png")
          }
        ></CoinImg>
        <Coin $isMe={isMe}>{coin}</Coin>
      </Right>
    </Wrapper>
  );
}

interface HighlightProps {
  $isMe: boolean;
}

const Wrapper = styled.View<HighlightProps>`
  height: 66px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: ${({ $isMe }) =>
    $isMe ? colors.primary50 : colors.neutral50};
  border: 1px solid
    ${({ $isMe }) => ($isMe ? colors.primary200 : "transparent")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
`;

const Left = styled.View`
  gap: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Center = styled.View`
  gap: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Rank = styled.Text<HighlightProps>`
  font-size: 16px;
  color: ${({ $isMe }) => ($isMe ? colors.primary500 : colors.neutral400)};
`;

const Name = styled.Text<HighlightProps>`
  font-size: 16px;
  font-weight: ${({ $isMe }) => ($isMe ? 600 : 400)};
  color: ${({ $isMe }) => ($isMe ? colors.primary500 : colors.neutral1000)};
`;

const Coin = styled.Text<HighlightProps>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $isMe }) => ($isMe ? colors.primary500 : colors.neutral600)};
`;

const CoinImg = styled.Image``;
