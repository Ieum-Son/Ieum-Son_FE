import { colors } from "@/constants/colors";
import { Image, type ImageSource } from "expo-image";
import styled from "styled-components/native";

interface CameraSelectionBoxProps {
  source: ImageSource;
  recognitionRate?: number;
}

export const getCameraPositionError = (recognitionRate?: number) => {
  if (recognitionRate === 0) {
    return "너무 가깝거나 멉니다. 카메라와의 위치를 조정해주세요.";
  }

  if (recognitionRate === 1) {
    return "얼굴이 인식되지 않았습니다.";
  }

  return null;
};

export default function CameraSelectionBox({
  source,
  recognitionRate = 0,
}: CameraSelectionBoxProps) {
  const normalizedRate = Math.min(Math.max(recognitionRate, 0), 100);
  const errorMessage = getCameraPositionError(recognitionRate);
  const displayedRate = errorMessage ? 0 : normalizedRate;

  return (
    <Container>
      <Wrapper
        accessible
        accessibilityLabel={`수어 동작 카메라 화면, 인식률 ${displayedRate}%${errorMessage ? `, ${errorMessage}` : ""}`}
      >
        <CameraImage source={source} contentFit="cover" />
        <RecognitionRate selectable>인식률 {displayedRate}%</RecognitionRate>
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

const ErrorMessage = styled.Text`
  margin-top: 6px;
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 18px;
`;
