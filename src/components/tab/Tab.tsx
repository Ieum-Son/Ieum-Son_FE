import BlueProfile from "@/assets/tab/blue/profile.png";
import BlueRanking from "@/assets/tab/blue/ranking.png";
import WhiteHome from "@/assets/tab/white/home.png";
import WhiteProfile from "@/assets/tab/white/profile.png";
import WhiteRanking from "@/assets/tab/white/ranking.png";
import { colors } from "@/constants/colors";
import { router, type Href } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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
    activeImg: WhiteHome,
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
  const [selectedTab, setSelectedTab] = useState<TabName>(activeTab);
  const [tabWidth, setTabWidth] = useState(0);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateX = useSharedValue(0);

  const activeIndex = tabItems.findIndex((tab) => tab.name === activeTab);

  useEffect(() => {
    setSelectedTab(activeTab);

    if (tabWidth > 0) {
      translateX.value = activeIndex * tabWidth;
    }
  }, [activeIndex, activeTab, tabWidth, translateX]);

  useEffect(
    () => () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    },
    [],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const itemWidth = event.nativeEvent.layout.width / tabItems.length;
    setTabWidth(itemWidth);
    translateX.value = activeIndex * itemWidth;
  };

  const handleTabPress = (tab: (typeof tabItems)[number]) => {
    if (tab.name === selectedTab) return;

    const targetIndex = tabItems.findIndex((item) => item.name === tab.name);
    setSelectedTab(tab.name);
    translateX.value = withTiming(targetIndex * tabWidth, { duration: 180 });

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = setTimeout(() => {
      router.replace(tab.href);
    }, 180);
  };

  return (
    <Wrapper>
      <TabContent onLayout={handleLayout}>
        {tabWidth > 0 && (
          <Indicator style={[{ width: tabWidth }, indicatorStyle]} />
        )}

        {tabItems.map((tab) => (
          <TabEach
            key={tab.name}
            img={
              selectedTab === tab.name ? tab.activeImg : tab.inactiveImg
            }
            text={tab.text}
            isActive={selectedTab === tab.name}
            onPress={() => handleTabPress(tab)}
          />
        ))}
      </TabContent>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 68px;
  flex-direction: row;
  padding: 4px 36px;
`;

const TabContent = styled.View`
  position: relative;
  flex: 1;
  flex-direction: row;
`;

const Indicator = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 60px;
  border-radius: 50px;
  background-color: ${colors.primary50};
`;
