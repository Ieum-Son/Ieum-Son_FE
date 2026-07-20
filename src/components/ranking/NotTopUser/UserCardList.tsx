import styled from "styled-components/native";
import UserCard, { type UserCardProps } from "./UserCard";

const users: UserCardProps[] = [
  {
    ranking: 4,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 53820,
  },
  {
    ranking: 5,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 42100,
  },
  {
    ranking: 6,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 38950,
  },
  {
    ranking: 7,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 31200,
  },
  {
    ranking: 8,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 28700,
  },
  {
    ranking: 9,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 25400,
  },
  {
    ranking: 10,
    profile: require("@/assets/user/defaultProfile.png"),
    name: "사용자명",
    coin: 22100,
  },
];

export default function UserCardList() {
  return (
    <Wrapper>
      {users.map((user) => (
        <UserCard key={user.ranking} {...user} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 12px;
`;
