import ProfileHeader from "@/components/header/ProfileHeader";
import SettingBlock from "@/components/Profile/setting/SettingBlock";
import SettingSection from "@/components/Profile/setting/SettingSection";
import SoundSettingControl from "@/components/Profile/setting/SoundSettingControl";
import { colors } from "@/constants/colors";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Setting() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.68);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Container>
        <ProfileHeader title="설정" />

        <Content
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <SettingSection title="지원" topSpacing={26}>
            <SettingBlock
              icon="coffee-outline"
              text="개발자에게 커피 사주기"
              option="next"
            />
            <SettingBlock icon="headphones" text="고객지원" option="next" />
          </SettingSection>

          <SettingSection title="환경설정" topSpacing={15}>
            <SoundSettingControl
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              volume={volume}
              onVolumeChange={setVolume}
            />
            <SettingBlock
              icon="bell-outline"
              text="알림"
              option="toggle"
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
            />
          </SettingSection>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: ${colors.neutral0};
`;

const Content = styled.ScrollView`
  flex: 1;
`;
