import ProfileHeader from "@/components/header/ProfileHeader";
import SettingBlock from "@/components/Profile/setting/SettingBlock";
import SettingSection from "@/components/Profile/setting/SettingSection";
import SoundSettingControl from "@/components/Profile/setting/SoundSettingControl";
import { colors } from "@/constants/colors";
import {
  getSettingErrorMessage,
  getUpdateSettingErrorMessage,
  useSetting,
  useUpdateSetting,
} from "@/hooks/Setting";
import { useSoundStore } from "@/stores/soundStore";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Setting() {
  const soundEnabled = useSoundStore((state) => state.soundEnabled);
  const volume = useSoundStore((state) => state.volume);
  const setSoundEnabled = useSoundStore((state) => state.setSoundEnabled);
  const setVolume = useSoundStore((state) => state.setVolume);

  const { data: setting, isPending, isError, error } = useSetting();
  const {
    mutate: updateSetting,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSetting();

  const notificationEnabled = setting?.alarmEnabled ?? false;
  const canChangeNotification = !isPending && !isError && !isUpdating;
  const errorMessage = isError
    ? getSettingErrorMessage(error)
    : updateError
      ? getUpdateSettingErrorMessage(updateError)
      : null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Container>
        <ProfileHeader title="설정" />

        <Content
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <SettingSection title="환경설정" topSpacing={26}>
            <SoundSettingControl
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              volume={volume}
              onVolumeChange={setVolume}
            />
            <SettingBlock
              icon="bell-outline"
              text="알림"
              value={notificationEnabled}
              onValueChange={
                canChangeNotification
                  ? (value) => updateSetting({ alarmEnabled: value })
                  : undefined
              }
            />
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
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

const ErrorText = styled.Text`
  margin: 0px 12px;
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;
