import { colors } from "@/constants/colors";
import type { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface ReviewVideoProps {
  source: ImageSourcePropType;
  word: string;
}

export default function ReviewVideo({ source, word }: ReviewVideoProps) {
  return (
    <Wrapper
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${word} 복습 문제 수어 자료`}
    >
      <Preview source={source} resizeMode="contain" />
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

const Preview = styled.Image`
  width: 100%;
  height: 100%;
  background-color: ${colors.neutral0};
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
