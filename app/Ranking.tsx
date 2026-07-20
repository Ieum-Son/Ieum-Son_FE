import Profile from "@/assets/user/defaultProfile.png";
import Header from "@/components/header/Header";
import MyRanking from "@/components/ranking/Me/MyRanking";
import UserCardList from "@/components/ranking/NotTopUser/UserCardList";
import TopUserList from "@/components/ranking/TopUser/TopUserList";
import Tab from "@/components/tab/Tab";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ranking() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Header />
        <TopUserList />
        <UserCardList />
      </ScrollView>
      <MyRanking ranking={'-'} profile={Profile} name="이태연" coin={988} />
      <Tab activeTab="ranking" />
    </SafeAreaView>
  );
}
