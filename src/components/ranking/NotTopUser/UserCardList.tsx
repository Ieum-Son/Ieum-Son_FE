import type { RankingItem } from "@/apis/ranking/type";
import styled from "styled-components/native";
import { getProfileSource } from "../profileSource";
import UserCard from "./UserCard";

interface UserCardListProps {
  items: RankingItem[];
}

export default function UserCardList({ items }: UserCardListProps) {
  return (
    <Wrapper>
      {items.map((item) => (
        <UserCard
          key={item.rank}
          ranking={item.rank}
          profile={getProfileSource(item.profileImageUrl)}
          name={item.name}
          coin={item.gold}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 12px;
`;
