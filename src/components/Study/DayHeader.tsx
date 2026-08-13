import ProfileHeader from "@/components/header/ProfileHeader";
import { colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

interface DayHeaderProps {
  day: number;
  progress: number;
  onBack?: () => void;
}

export default function DayHeader({ day, progress, onBack }: DayHeaderProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

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
          style={{ width: `${normalizedProgress * 100}%` }}
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

const ProgressFill = styled(LinearGradient)`
  height: 100%;
  border-radius: 9999px;
`;
