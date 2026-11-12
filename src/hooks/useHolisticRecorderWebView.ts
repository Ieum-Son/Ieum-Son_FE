import { useHolisticStore } from "@/stores/holisticStore";

/**
 * 네이티브 모듈이 없는 환경(Expo Go)에서 쓰는 녹화 훅.
 * 좌표는 WebView가 뽑아 store에 밀어넣고, 여기서는 녹화 구간만 여닫는다.
 * CameraPreviewWebView가 store의 isRecording을 보고 WebView에 알려준다.
 */
export const useHolisticRecorderWebView = () => {
  const isRecording = useHolisticStore((state) => state.isRecording);
  const frameCount = useHolisticStore((state) => state.frameCount);
  const start = useHolisticStore((state) => state.start);
  const stop = useHolisticStore((state) => state.stop);
  const reset = useHolisticStore((state) => state.reset);

  return {
    // 프레임 프로세서는 vision-camera 전용이다. WebView 쪽은 쓰지 않는다.
    frameProcessor: undefined,
    isRecording,
    frameCount,
    start,
    stop,
    reset,
  };
};
