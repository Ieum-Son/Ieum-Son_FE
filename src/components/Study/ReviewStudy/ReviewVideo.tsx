import { colors } from "@/constants/colors";
import styled from "styled-components/native";

export default function ReviewVideo() {
  return (
    <Wrapper
      accessible
      accessibilityRole="image"
      accessibilityLabel="복습 문제 수어 영상"
    >
      <VideoLabel>수어 영상</VideoLabel>
      <Controls accessibilityElementsHidden>
        <PlayIcon>▶</PlayIcon>
        <Time>0:00 / 0:03</Time>
        <Spacer />
        <ControlIcon>◖</ControlIcon>
        <ControlIcon>⛶</ControlIcon>
        <ControlIcon>⋮</ControlIcon>
      </Controls>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 258px;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${colors.neutral800};
`;

const VideoLabel = styled.Text`
  color: ${colors.neutral400};
  font-size: 14px;
  font-weight: 500;
`;

const Controls = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
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

const Spacer = styled.View`
  flex: 1;
`;

const ControlIcon = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
`;
