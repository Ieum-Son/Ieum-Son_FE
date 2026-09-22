import Header from "@/components/header/Header";
import MyRanking from "@/components/ranking/Me/MyRanking";
import UserCardList from "@/components/ranking/NotTopUser/UserCardList";
import { getProfileSource } from "@/components/ranking/profileSource";
import TopUserList from "@/components/ranking/TopUser/TopUserList";
import Tab from "@/components/tab/Tab";
import { colors } from "@/constants/colors";
import { getRankingErrorMessage, useRanking } from "@/hooks/Ranking";
import { useUserStore } from "@/stores/userStore";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const TOP_RANK_LIMIT = 3;
const RANKING_SIZE = 100;

export default function Ranking() {
  const user = useUserStore((state) => state.user);
  const { data, isPending, isError, error, refetch, isRefetching } = useRanking(
    { size: RANKING_SIZE },
  );

  const items = data?.items ?? [];
  const topUsers = items.filter((item) => item.rank <= TOP_RANK_LIMIT);
  const otherUsers = items.filter((item) => item.rank > TOP_RANK_LIMIT);
  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary400}
          />
        }
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
            <PlaceholderText $isError>
              {getRankingErrorMessage(error)}
            </PlaceholderText>
          </Placeholder>
        ) : isEmpty ? (
          <Placeholder>
            <PlaceholderText>아직 랭킹에 오른 사용자가 없어요.</PlaceholderText>
          </Placeholder>
        ) : (
          <>
            <TopUserList items={topUsers} />
            <UserCardList items={otherUsers} />
          </>
        )}
      </ScrollView>

      {data && (
        <MyRanking
          ranking={data.myRank}
          profile={getProfileSource(user?.profileImageUrl)}
          name={user?.name || "사용자명"}
          coin={data.myGold}
          totalMembers={data.totalMembers}
        />
      )}
      <Tab activeTab="ranking" />
    </SafeAreaView>
  );
}

const Placeholder = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.Text<{ $isError?: boolean }>`
  color: ${({ $isError }) => ($isError ? colors.errorRed : colors.neutral500)};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
`;
