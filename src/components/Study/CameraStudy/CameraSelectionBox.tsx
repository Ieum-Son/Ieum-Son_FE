import { colors } from "@/constants/colors";
import type { ReadonlyFrameProcessor } from "react-native-vision-camera";
import styled from "styled-components/native";
import CameraPreview from "./CameraPreview";

interface CameraSelectionBoxProps {
  recognitionRate?: number;
  frameProcessor?: ReadonlyFrameProcessor;
  isCameraActive?: boolean;
}

/** 이 아래면 자세를 다시 잡도록 안내한다. */
const LOW_RECOGNITION_RATE = 40;

export const getCameraPositionError = (recognitionRate?: number) => {
  // 아직 인식 결과가 없으면 안내할 것이 없다.
  if (recognitionRate === undefined) return null;

  if (recognitionRate < LOW_RECOGNITION_RATE) {
    return "인식률이 낮아요. 카메라와의 거리를 조정하고 손이 화면 안에 들어오게 해주세요.";
  }

  return null;
};

export default function CameraSelectionBox({
  recognitionRate,
  frameProcessor,
  isCameraActive = false,
}: CameraSelectionBoxProps) {
  const hasResult = recognitionRate !== undefined;
  const displayedRate = hasResult
    ? Math.min(Math.max(recognitionRate, 0), 100)
    : null;
  const errorMessage = getCameraPositionError(recognitionRate);

  return (
    <Container>
      <Wrapper
        accessible
        accessibilityLabel={`수어 동작 카메라 화면${displayedRate === null ? "" : `, 인식률 ${displayedRate}%`}${errorMessage ? `, ${errorMessage}` : ""}`}
      >
        <CameraPreview
          frameProcessor={frameProcessor}
          isActive={isCameraActive}
        />

        {displayedRate === null ? null : (
          <RecognitionRate selectable>인식률 {displayedRate}%</RecognitionRate>
        )}
      </Wrapper>

      {errorMessage ? (
        <ErrorMessage accessibilityLiveRegion="polite">
          {errorMessage}
        </ErrorMessage>
      ) : null}
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
`;

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: 254px;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${colors.neutral800};
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

const ErrorMessage = styled.Text`
  margin-top: 6px;
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 18px;
`;
