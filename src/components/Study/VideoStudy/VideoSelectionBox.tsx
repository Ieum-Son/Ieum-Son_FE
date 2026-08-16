import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface VideoSelectionBoxProps {
  label?: string;
  onPress?: () => void;
}

export default function VideoSelectionBox({
  label = "학습 영상",
  onPress,
}: VideoSelectionBoxProps) {
  return (
    <Wrapper
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
    >
      <VideoPlaceholder accessibilityElementsHidden>
        <PlaceholderLabel>{label}</PlaceholderLabel>
      </VideoPlaceholder>
      <Controls>
        <PlayIcon>▶</PlayIcon>
        <Time>0:00 / 0:03</Time>
        <ControlSpacer />
        <ControlIcon>◖</ControlIcon>
        <ControlIcon>⛶</ControlIcon>
        <ControlIcon>⋮</ControlIcon>
      </Controls>
    </Wrapper>
  );
}

const Wrapper = styled.Pressable`
  width: 100%;
  height: 258px;
  overflow: hidden;
  background-color: ${colors.neutral1000};
`;

const VideoPlaceholder = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.neutral800};
`;

const PlaceholderLabel = styled.Text`
  color: ${colors.neutral300};
  font-size: 14px;
  font-weight: 500;
`;

const Controls = styled.View`
  height: 34px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${colors.neutral1000};
`;

const PlayIcon = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
`;

const Time = styled.Text`
  color: ${colors.neutral0};
  font-size: 12px;
  font-weight: 600;
`;

const ControlSpacer = styled.View`
  flex: 1;
`;

const ControlIcon = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
`;
