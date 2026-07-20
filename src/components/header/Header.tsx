import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components/native";

export default function Header() {
  return (
    <>
      <Wrapper>
        <Left>
          <CoinImg
            source={require("@/assets/header/mode_heat/베리언트3.png")}
          ></CoinImg>
          <Coin>168</Coin>
        </Left>
        <Right>
          <SettingImg
            source={require("@/assets/header/setting.png")}
          ></SettingImg>
        </Right>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.View`
  height: 48px;
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Right = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CoinImg = styled.Image`
  width: 24px;
  height: 24px;
`;

const SettingImg = styled.Image`
  width: 28px;
  height: 28px;
`;

const Coin = styled.Text`
  font-size: 18px;
  color: ${colors.neutral600};
  font-weight: 600;
`;
