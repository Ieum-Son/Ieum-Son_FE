import styled from "styled-components/native";
import TopUserCard, { type TopUser } from "./TopUserCard";

const displayOrder = [2, 1, 3] as const;

const topUsers: TopUser[] = [
  {
    ranking: 1,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 168455,
  },
  {
    ranking: 2,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 168244,
  },
  {
    ranking: 3,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 55554,
  },
];

export default function TopUserList() {
  const usersByRanking = new Map(
    topUsers.map((user) => [user.ranking, user]),
  );

  return (
    <Wrapper>
      {displayOrder.map((ranking) => {
        const user = usersByRanking.get(ranking);

        return user ? <TopUserCard key={ranking} {...user} /> : null;
      })}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
`;
