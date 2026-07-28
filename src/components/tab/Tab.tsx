import BlueHome from "@/assets/tab/blue/home.png";
import BlueProfile from "@/assets/tab/blue/profile.png";
import BlueRanking from "@/assets/tab/blue/ranking.png";
import WhiteHome from "@/assets/tab/white/home.png";
import WhiteProfile from "@/assets/tab/white/profile.png";
import WhiteRanking from "@/assets/tab/white/ranking.png";
import { router, type Href } from "expo-router";
import styled from "styled-components/native";
import TabEach from "./TabEach";

export type TabName = "home" | "ranking" | "profile";

interface TabProps {
  activeTab: TabName;
}

const tabItems = [
  {
    name: "home",
    text: "홈",
    activeImg: BlueHome,
    inactiveImg: WhiteHome,
    href: "/" as Href,
  },
  {
    name: "ranking",
    text: "랭킹",
    activeImg: BlueRanking,
    inactiveImg: WhiteRanking,
    href: "/Ranking" as Href,
  },
  {
    name: "profile",
    text: "프로필",
    activeImg: BlueProfile,
    inactiveImg: WhiteProfile,
    href: "/Profile/Profile" as Href,
  },
] as const;

export default function Tab({ activeTab }: TabProps) {
  return (
    <Wrapper>
      {tabItems.map((tab) => (
        <TabEach
          key={tab.name}
          img={activeTab === tab.name ? tab.activeImg : tab.inactiveImg}
          text={tab.text}
          isActive={activeTab === tab.name}
          onPress={() => router.replace(tab.href)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 68px;
  flex-direction: row;
  padding: 4px 36px;
`;
