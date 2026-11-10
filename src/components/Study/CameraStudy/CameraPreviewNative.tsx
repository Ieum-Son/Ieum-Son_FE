import { colors } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import type {
  CameraRuntimeError,
  ReadonlyFrameProcessor,
} from "react-native-vision-camera";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import styled from "styled-components/native";

interface CameraPreviewProps {
  frameProcessor: ReadonlyFrameProcessor;
  isActive: boolean;
}

export default function CameraPreview({
  frameProcessor,
  isActive,
}: CameraPreviewProps) {
  const device = useCameraDevice("front");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasPermission) return;

    void requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <Placeholder>
        <PlaceholderText>
          수어를 확인하려면 카메라 권한이 필요해요.
        </PlaceholderText>
      </Placeholder>
    );
  }

  if (!device) {
    return (
      <Placeholder>
        <PlaceholderText>사용할 수 있는 카메라가 없어요.</PlaceholderText>
      </Placeholder>
    );
  }

  if (errorMessage) {
    return (
      <Placeholder>
        <PlaceholderText selectable>{errorMessage}</PlaceholderText>
      </Placeholder>
    );
  }

  return (
    <Preview
      device={device}
      isActive={isActive}
      frameProcessor={frameProcessor}
      // 미리보기는 거울로 보여준다. 거울이 아니면 따라하기 어렵다.
      // 감지에 넣는 프레임을 반전할지는 MIRROR_BEFORE_DETECTION이 정하고,
      // 프레임 프로세서 인자로 넘어가므로 여기서는 건드리지 않는다.
      //
      // iOS는 MPImage가 YUV 버퍼를 그대로 받지만 안드로이드 플러그인은
      // Bitmap을 만들어야 해서 RGBA 한 장으로 받는다.
      pixelFormat={Platform.OS === "android" ? "rgb" : "yuv"}
      // onError를 주지 않으면 런타임 오류가 그대로 던져져서 CameraError
      // 생성자 스택만 남고 어떤 코드였는지 알 수 없다.
      onError={(cameraError: CameraRuntimeError) => {
        console.error("[camera]", cameraError.code, cameraError.message);
        setErrorMessage(
          `카메라 오류: ${cameraError.code}\n${cameraError.message}`,
        );
      }}
    />
  );
}

const Preview = styled(Camera)`
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const PlaceholderText = styled.Text`
  color: ${colors.neutral0};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;
