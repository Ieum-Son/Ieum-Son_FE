import Header from "@/components/header/Header";
import MyRanking from "@/components/ranking/Me/MyRanking";
import UserCardList from "@/components/ranking/NotTopUser/UserCardList";
import { getProfileSource } from "@/components/ranking/profileSource";
import TopUserList from "@/components/ranking/TopUser/TopUserList";
import Tab from "@/components/tab/Tab";
import { colors } from "@/constants/colors";
import { getRankingErrorMessage, useRanking } from "@/hooks/Ranking";
import { useUserStore } from "@/stores/userStore";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const TOP_RANK_LIMIT = 3;

export default function Ranking() {
  const user = useUserStore((state) => state.user);
  const { data, isPending, isError, error } = useRanking();

  const items = data?.items ?? [];
  const topUsers = items.filter((item) => item.rank <= TOP_RANK_LIMIT);
  const otherUsers = items.filter((item) => item.rank > TOP_RANK_LIMIT);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
          <Header />
        </View>

        {isPending ? (
          <Placeholder>
            <ActivityIndicator color={colors.primary400} />
          </Placeholder>
        ) : isError ? (
          <Placeholder>
            <ErrorText>{getRankingErrorMessage(error)}</ErrorText>
          </Placeholder>
        ) : (
          <>
            <TopUserList items={topUsers} />
            <UserCardList items={otherUsers} />
          </>
        )}
      </ScrollView>

      <MyRanking
        ranking={data?.myRank ?? "-"}
        profile={getProfileSource(user?.profileImageUrl)}
        name={user?.name || "사용자명"}
        coin={data?.myGold ?? 0}
      />
      <Tab activeTab="ranking" />
    </SafeAreaView>
  );
}

const Placeholder = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
`;
