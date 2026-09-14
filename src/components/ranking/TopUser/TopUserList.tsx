import type { RankingItem } from "@/apis/ranking/type";
import styled from "styled-components/native";
import { getProfileSource } from "../profileSource";
import TopUserCard, { type TopUser } from "./TopUserCard";

const displayOrder = [2, 1, 3] as const;

interface TopUserListProps {
  items: RankingItem[];
}

export default function TopUserList({ items }: TopUserListProps) {
  const usersByRanking = new Map<number, TopUser>(
    items.map((item) => [
      item.rank,
      {
        ranking: item.rank as TopUser["ranking"],
        profile: getProfileSource(item.profileImageUrl),
        name: item.name,
        coin: item.gold,
      },
    ]),
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
  margin-bottom: 20px;
`;
