import ProfileHeader from "@/components/header/ProfileHeader";
import StreakHistoryList from "@/components/Profile/StreakHistory/StreakHistoryList";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function StreakHistoryPage() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flexGrow: 1 }}
      >
        <Container>
          <ProfileHeader title="스트릭 사용처 조회" />
          <View style={{ marginBottom: 20 }} />
          <StreakHistoryList />
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;
