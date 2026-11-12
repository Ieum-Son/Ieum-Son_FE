import { isExpoGo } from "./runtime";

/**
 * vision-camera를 쓰는 모듈을 안전하게 불러온다.
 *
 * vision-camera는 네이티브 모듈을 찾지 못하면 import하는 순간
 * CameraRuntimeError를 던진다(system/camera-module-not-found).
 * 모듈 초기화 중에 터지는 거라 화면에는 CameraError 생성자 스택만 남고
 * 무엇이 없는지 알 수 없는 채로 앱 전체가 뜨지 않는다.
 *
 * Expo Go, pod install을 하지 않은 iOS, gradle 동기화를 하지 않은 안드로이드,
 * 네이티브를 다시 빌드하지 않은 경우가 모두 여기에 해당한다.
 * isExpoGo로 걸러지지 않는 경우가 있으니 던지는 것까지 받아 둔다.
 *
 * 불러오지 못하면 null을 돌려주고, 호출하는 쪽은 WebView 경로로 돌아간다.
 */
export const loadVisionCameraModule = <T,>(load: () => T): T | null => {
  if (isExpoGo) return null;

  try {
    return load();
  } catch (error) {
    console.warn(
      "[camera] vision-camera를 불러오지 못해 WebView 경로로 돌아갑니다.",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );

    return null;
  }
};
