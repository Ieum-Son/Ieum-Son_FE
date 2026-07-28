import { colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

interface SettingToggleProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function SettingToggle({
  value,
  onValueChange,
}: SettingToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.neutral300, colors.primary300],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 20 }],
  }));

  return (
    <Toggle
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      disabled={!onValueChange}
      onPress={() => onValueChange?.(!value)}
    >
      <Track style={trackStyle}>
        <Thumb style={thumbStyle}>
          <MaterialCommunityIcons
            name={value ? "check" : "close"}
            size={14}
            color={value ? colors.primary300 : colors.neutral300}
          />
        </Thumb>
      </Track>
    </Toggle>
  );
}

const Toggle = styled.Pressable`
  width: 44px;
  height: 24px;
`;

const Track = styled(Animated.View)`
  width: 44px;
  height: 24px;
  padding: 2px;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
`;

const Thumb = styled(Animated.View)`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${colors.neutral0};
`;
