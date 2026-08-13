import { colors } from "@/constants/colors";
import { Image, type ImageSource } from "expo-image";
import styled from "styled-components/native";

interface CameraSelectionBoxProps {
  source: ImageSource;
  recognitionRate?: number;
}

export default function CameraSelectionBox({
  source,
  recognitionRate = 0,
}: CameraSelectionBoxProps) {
  const normalizedRate = Math.min(Math.max(recognitionRate, 0), 100);

  return (
    <Wrapper
      accessible
      accessibilityLabel={`수어 동작 카메라 화면, 인식률 ${normalizedRate}%`}
    >
      <CameraImage source={source} contentFit="cover" />
      <RecognitionRate selectable>인식률 {normalizedRate}%</RecognitionRate>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: 254px;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${colors.neutral100};
`;

const CameraImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const RecognitionRate = styled.Text`
  position: absolute;
  top: 12px;
  right: 12px;
  color: ${colors.neutral0};
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
`;
