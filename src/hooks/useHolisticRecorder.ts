import type { HolisticFrame } from "@/apis/studySocket/type";
import { loadVisionCameraModule } from "@/utils/nativeCamera";
import type { ReadonlyFrameProcessor } from "react-native-vision-camera";
import { useHolisticRecorderWebView } from "./useHolisticRecorderWebView";

export interface HolisticRecorder {
  frameProcessor?: ReadonlyFrameProcessor;
  isRecording: boolean;
  frameCount: number;
  start: () => void;
  stop: () => HolisticFrame[];
  reset: () => void;
}

// vision-camera가 없는 빌드에서는 불러오면 앱이 뜨지 않으므로 막는다.
// 파일명에 .native를 쓰면 Metro가 플랫폼 확장자로 보고 이 분기보다 먼저
// 그 파일을 집어간다. 그래서 일반 이름으로 둔다.
const useNativeRecorder = loadVisionCameraModule<() => HolisticRecorder>(
  () => require("./useHolisticRecorderNative").useHolisticRecorderNative,
);

/**
 * 개발 빌드에서는 vision-camera 프레임 프로세서로,
 * Expo Go에서는 WebView의 MediaPipe JS로 좌표를 뽑는다.
 */
export const useHolisticRecorder: () => HolisticRecorder =
  useNativeRecorder ?? useHolisticRecorderWebView;
