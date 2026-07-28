import { colors } from "@/constants/colors";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import Profile from "../Profile";

export interface MyRankingProps {
  ranking: number | "-";
  profile: ImageSourcePropType;
  name: string;
  coin: number;
}

export default function MyRanking({
  ranking,
  profile,
  name,
  coin,
}: MyRankingProps) {
  return (
    <Wrapper>
      <Left>
        <Rank>{ranking}</Rank>

        <Center>
          <Profile profile={profile} />
          <Name>(나) {name}</Name>
        </Center>
      </Left>
      <Right>
        <CoinImg source={require("@/assets/user/CoinBlue.png")}></CoinImg>
        <Coin>{coin}</Coin>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 66px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: ${colors.primary50};
  border: 1px solid ${colors.primary200};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
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
  color: ${colors.primary500};
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.primary500};
`;

const Coin = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
  color: ${colors.primary500};
`;

const CoinImg = styled.Image``;
