import Profile from "@/assets/user/defaultProfile.png";
import Header from "@/components/header/Header";
import MyRanking from "@/components/ranking/Me/MyRanking";
import UserCardList from "@/components/ranking/NotTopUser/UserCardList";
import TopUserList from "@/components/ranking/TopUser/TopUserList";
import Tab from "@/components/tab/Tab";
import { useUserStore } from "@/stores/userStore";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ranking() {
  const user = useUserStore((state) => state.user);
  const profileSource = user?.profileImageUrl
    ? { uri: user.profileImageUrl }
    : Profile;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
          <Header />
        </View>
        <TopUserList />
        <UserCardList />
      </ScrollView>
      <MyRanking
        ranking="-"
        profile={profileSource}
        name={user?.name || user?.loginId || "사용자명"}
          coin={user?.gold ?? 0}
      />
      <Tab activeTab="ranking" />
    </SafeAreaView>
  );
}
