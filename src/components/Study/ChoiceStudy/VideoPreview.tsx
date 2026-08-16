import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface VideoPreviewProps {
  label: string;
}

export default function VideoPreview({ label }: VideoPreviewProps) {
  return (
    <Wrapper
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${label} 영상 미리보기`}
    >
      <PreviewLabel selectable>{label} 미리보기</PreviewLabel>
      <PlayButton>
        <PlayIcon>▶</PlayIcon>
      </PlayButton>
      <Controls>
        <ControlText>▶</ControlText>
        <Timeline>
          <TimelineProgress />
        </Timeline>
        <ControlText>0:00 / 0:03</ControlText>
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
  border-radius: 2px;
  background-color: ${colors.neutral800};
`;

const PreviewLabel = styled.Text`
  color: ${colors.neutral400};
  font-size: 14px;
  font-weight: 500;
`;

const PlayButton = styled.View`
  width: 52px;
  height: 52px;
  margin-top: 12px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.45);
`;

const PlayIcon = styled.Text`
  margin-left: 3px;
  color: ${colors.neutral0};
  font-size: 22px;
`;

const Controls = styled.View`
  position: absolute;
  right: 14px;
  bottom: 12px;
  left: 14px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ControlText = styled.Text`
  color: ${colors.neutral0};
  font-size: 12px;
`;

const Timeline = styled.View`
  height: 3px;
  flex: 1;
  overflow: hidden;
  border-radius: 9999px;
  background-color: ${colors.neutral600};
`;

const TimelineProgress = styled.View`
  width: 0%;
  height: 100%;
  background-color: ${colors.neutral0};
`;
