import { colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import React, { useEffect, useState } from "react";
import type {
  AccessibilityActionEvent,
  GestureResponderEvent,
} from "react-native";
import styled from "styled-components/native";

const previewSound = require("../../../assets/audio/volume-preview.wav");

interface VolumeControlProps {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export default function VolumeControl({
  value,
  onValueChange,
  disabled = false,
}: VolumeControlProps) {
  const previewPlayer = useAudioPlayer(previewSound);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const playVolumePreview = async (nextVolume: number) => {
    if (!previewPlayer.isLoaded) return;

    previewPlayer.pause();
    previewPlayer.volume = nextVolume;
    await previewPlayer.seekTo(0);
    previewPlayer.play();
  };

  const getVolumeFromEvent = (event: GestureResponderEvent) => {
    if (trackWidth === 0) return value;

    return Math.min(
      1,
      Math.max(0, event.nativeEvent.locationX / trackWidth),
    );
  };

  const handleVolumeChange = (event: GestureResponderEvent) => {
    onValueChange(getVolumeFromEvent(event));
  };

  const handleVolumeComplete = (event: GestureResponderEvent) => {
    const nextVolume = getVolumeFromEvent(event);
    onValueChange(nextVolume);
    void playVolumePreview(nextVolume);
  };

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (disabled) return;

    const direction = event.nativeEvent.actionName === "increment" ? 1 : -1;
    const nextVolume = Math.min(
      1,
      Math.max(0, Math.round((value + direction * 0.1) * 10) / 10),
    );

    onValueChange(nextVolume);
    void playVolumePreview(nextVolume);
  };

  return (
    <Wrapper>
      <MaterialCommunityIcons
        name="volume-medium"
        size={20}
        color={colors.neutral600}
      />
      <TrackTouchArea
        $disabled={disabled}
        accessibilityRole="adjustable"
        accessibilityLabel="볼륨"
        accessibilityState={{ disabled }}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(value * 100),
        }}
        accessibilityActions={[
          { name: "increment", label: "볼륨 높이기" },
          { name: "decrement", label: "볼륨 낮추기" },
        ]}
        onAccessibilityAction={handleAccessibilityAction}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderGrant={handleVolumeChange}
        onResponderMove={handleVolumeChange}
        onResponderRelease={handleVolumeComplete}
      >
        <Track>
          <Fill style={{ width: `${value * 100}%` }} />
          <Thumb style={{ left: `${value * 100}%` }} />
        </Track>
      </TrackTouchArea>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 20px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding-left: 44px;
`;

const TrackTouchArea = styled.View<{ $disabled: boolean }>`
  flex: 1;
  height: 20px;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Track = styled.View`
  position: relative;
  width: 100%;
  height: 6px;
  border-width: 1px;
  border-color: ${colors.neutral300};
  border-radius: 9999px;
  background-color: ${colors.neutral200};
`;

const Fill = styled.View`
  height: 100%;
  border-radius: 9999px;
  background-color: ${colors.primary300};
`;

const Thumb = styled.View`
  position: absolute;
  top: -3px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  border-radius: 6px;
  background-color: ${colors.primary300};
`;
