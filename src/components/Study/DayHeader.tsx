import ProfileHeader from "@/components/header/ProfileHeader";
import { colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface DayHeaderProps {
  day: number;
  progress: number;
  initialProgress?: number;
  onBack?: () => void;
}

export default function DayHeader({
  day,
  progress,
  initialProgress = 0,
  onBack,
}: DayHeaderProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const normalizedInitialProgress = Math.min(
    Math.max(initialProgress, 0),
    normalizedProgress,
  );
  const animatedProgress = useSharedValue(normalizedInitialProgress);

  useEffect(() => {
    animatedProgress.value = withTiming(normalizedProgress, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [animatedProgress, normalizedProgress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <Wrapper>
      <HeaderAlignment>
        <ProfileHeader title={`Day ${day}`} onBackPress={onBack} />
      </HeaderAlignment>

      <ProgressTrack
        accessibilityRole="progressbar"
        accessibilityLabel={`Day ${day} 학습 진행률`}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(normalizedProgress * 100),
        }}
      >
        <ProgressFill
          colors={[colors.primary200, colors.primary500]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={animatedProgressStyle}
        />
      </ProgressTrack>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 12px;
`;

const HeaderAlignment = styled.View`
  margin: 0 -10px;
`;

const ProgressTrack = styled.View`
  width: 100%;
  height: 12px;
  overflow: hidden;
  border: 1px solid ${colors.neutral200};
  border-radius: 9999px;
  background-color: ${colors.neutral100};
  align-self: stretch;
`;

const ProgressFill = styled(AnimatedLinearGradient)`
  height: 100%;
  border-radius: 9999px;
`;
