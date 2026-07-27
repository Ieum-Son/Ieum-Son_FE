import ProfileHeader from "@/components/header/ProfileHeader";
import FavoritesWordList from "@/components/Profile/FavoritesWord/FavoritesWordList";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function FavoritesWords() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Container>
          <ProfileHeader title="즐겨찾기한 단어" />
          <View style={{ marginBottom: 20 }} />
          <FavoritesWordList />
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;
