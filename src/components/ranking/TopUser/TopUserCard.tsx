import { colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import Profile from "../Profile";

export interface TopUser {
  profile: ImageSourcePropType;
  ranking: 1 | 2 | 3;
  name: string;
  coin: number;
}

const rankStyles = {
  1: {
    badgeColor: "#F4BC2E",
    podiumColors: ["#FFE590", "#E6A708"] as const,
    podiumHeight: 125,
  },
  2: {
    badgeColor: "#D8DAE6",
    podiumColors: ["#E4E5ED", "#B9BBC7"] as const,
    podiumHeight: 95,
  },
  3: {
    badgeColor: "#E8A04B",
    podiumColors: ["#F0B064", "#E59A40"] as const,
    podiumHeight: 75,
  },
};

export default function TopUserCard({ profile, ranking, name, coin }: TopUser) {
  const style = rankStyles[ranking];

  return (
    <Wrapper>
      {ranking === 1 && (
        <Crown
          source={require("@/assets/user/crown.png")}
          resizeMode="contain"
        />
      )}

      <ProfileWrapper>
        <Profile profile={profile} width={80} height={80} />
        <RankBadge $backgroundColor={style.badgeColor}>
          <Rank>{ranking}</Rank>
        </RankBadge>
      </ProfileWrapper>

      <Name numberOfLines={1}>{name}</Name>

      <CoinWrapper>
        <CoinImg source={require("@/assets/user/coin.png")} />
        <Coin>{coin}</Coin>
      </CoinWrapper>

      <Podium
        colors={style.podiumColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        $height={style.podiumHeight}
      />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100px;
  align-items: center;
`;

const ProfileWrapper = styled.View`
  position: relative;
`;

const Crown = styled.Image`
  width: 32px;
  height: 24px;
  margin-bottom: 6px;
`;

const RankBadge = styled.View<{ $backgroundColor: string }>`
  position: absolute;
  top: 4px;
  left: -4px;
  width: 24px;
  height: 24px;
  border: 1px solid white;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Rank = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: white;
`;

const Name = styled.Text`
  max-width: 100px;
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const CoinWrapper = styled.View`
  width: 97px;
  height: 22px;
  margin-bottom: 15px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.neutral100};
  border-radius: 100px;
  background-color: ${colors.neutral50};
`;

const Coin = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
`;

const CoinImg = styled.Image``;

const Podium = styled(LinearGradient)<{ $height: number }>`
  width: 100px;
  height: ${({ $height }) => $height}px;
  border-radius: 12px 12px 0 0;
`;
