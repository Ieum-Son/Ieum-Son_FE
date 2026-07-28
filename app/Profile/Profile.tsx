import Header from "@/components/header/Header";
import ProfileOptionList from "@/components/Profile/User/ProfileOptionList";
import StreakOverview from "@/components/Profile/User/StreakOverview/StreakOverview";
import User from "@/components/Profile/User/User";
import Tab from "@/components/tab/Tab";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Content>
          <Header />
          <User />
          <StreakOverview />
          <ProfileOptionList />
        </Content>
        <Tab activeTab="profile" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Content = styled.View`
  flex: 1;
  padding: 10px;
`;
