import { colors } from "@/constants/colors";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import Profile from "./Profile";

interface UserCardProps {
  ranking: number;
  profile: ImageSourcePropType;
  name: string;
  coin: number;
}

export default function UserCard({
  ranking,
  profile,
  name,
  coin,
}: UserCardProps) {
  return (
    <Wrapper>
      <Left>
        <Rank>{ranking}</Rank>

        <Center>
          <Profile profile={profile} />
          <Name>{name}</Name>
        </Center>
      </Left>
      <Right>
        <CoinImg source={require("@/assets/user/coin.png")}></CoinImg>
        <Coin>{coin}</Coin>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 66px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: ${colors.neutral50};
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

const Rank = styled.Text`
  font-size: 16px;
  color: ${colors.neutral400};
`;

const Name = styled.Text`
  font-size: 16px;
`;

const Coin = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
`;

const CoinImg = styled.Image``;
