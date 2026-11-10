import { loadVisionCameraModule } from "@/utils/nativeCamera";
import React from "react";
import type { ReadonlyFrameProcessor } from "react-native-vision-camera";
import CameraPreviewWebView from "./CameraPreviewWebView";

export interface CameraPreviewProps {
  frameProcessor?: ReadonlyFrameProcessor;
  isActive: boolean;
}

// vision-camera가 없는 빌드에서는 불러오는 순간 앱이 죽는다.
// 불러오기를 조건과 try/catch 안에 둬서 WebView 경로로 돌아가게 한다.
const CameraPreviewNative = loadVisionCameraModule<
  React.ComponentType<CameraPreviewProps>
>(() => require("./CameraPreviewNative").default);

export default function CameraPreview(props: CameraPreviewProps) {
  // 프레임 프로세서가 없으면 네이티브 경로를 쓸 수 없으니 WebView로 돌린다.
  if (!CameraPreviewNative || !props.frameProcessor) {
    return <CameraPreviewWebView isActive={props.isActive} />;
  }

  return <CameraPreviewNative {...props} />;
}
