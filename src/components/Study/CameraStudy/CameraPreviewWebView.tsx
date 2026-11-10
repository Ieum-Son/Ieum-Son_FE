import type { HolisticFrame } from "@/apis/studySocket/type";
import { colors } from "@/constants/colors";
import { useHolisticStore } from "@/stores/holisticStore";
import React, { useCallback, useEffect, useRef } from "react";
import WebView, { type WebViewMessageEvent } from "react-native-webview";
import styled from "styled-components/native";
import { HOLISTIC_WEB_VIEW_HTML } from "./holisticWebViewHtml";

interface CameraPreviewWebViewProps {
  isActive: boolean;
}

/**
 * getUserMedia는 보안 컨텍스트에서만 열린다.
 * 인라인 HTML은 origin이 없어서 https를 base로 심어 줘야 카메라가 열린다.
 */
const WEB_VIEW_ORIGIN = "https://localhost/";

const ERROR_MESSAGES: Record<string, string> = {
  insecure: "이 환경에서는 카메라를 열 수 없어요.",
  camera: "카메라 권한을 허용해 주세요.",
  model: "수어 인식 모델을 불러오지 못했어요. 네트워크를 확인해 주세요.",
};

const UNKNOWN_ERROR_MESSAGE = "카메라를 준비하지 못했어요.";

type WebViewMessage =
  | { type: "ready" }
  /** at은 WebView가 그 장을 찍은 시각이다. postMessage 지연이 섞이면 안 된다. */
  | { type: "frame"; frame: HolisticFrame; at?: number }
  | { type: "error"; reason?: string; detail?: string };

const parseMessage = (data: string): WebViewMessage | null => {
  try {
    const parsed: unknown = JSON.parse(data);

    if (typeof parsed !== "object" || parsed === null) return null;
    if (!("type" in parsed)) return null;

    return parsed as WebViewMessage;
  } catch {
    return null;
  }
};

/**
 * 네이티브 모듈이 없는 환경(Expo Go)에서 쓰는 카메라다.
 * WebView 안에서 카메라를 열고 MediaPipe JS로 좌표를 뽑아
 * 프레임마다 store에 쌓는다. 소켓으로 보내는 쪽은 그대로 쓴다.
 */
export default function CameraPreviewWebView({
  isActive,
}: CameraPreviewWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const isRecording = useHolisticStore((state) => state.isRecording);
  const error = useHolisticStore((state) => state.error);
  const pushFrame = useHolisticStore((state) => state.pushFrame);
  const setReady = useHolisticStore((state) => state.setReady);
  const setError = useHolisticStore((state) => state.setError);

  // 녹화 구간은 RN이 정하고 WebView에 알려준다.
  useEffect(() => {
    const shouldRecord = isRecording && isActive;

    webViewRef.current?.injectJavaScript(
      `window.__holistic?.setRecording(${String(shouldRecord)}); true;`,
    );
  }, [isRecording, isActive]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseMessage(event.nativeEvent.data);

      if (!message) return;

      if (message.type === "frame") {
        // 찍은 시각이 빠진 장은 받은 시각으로 둔다. 간격만 조금 흔들린다.
        pushFrame(message.frame, message.at ?? Date.now());

        return;
      }

      if (message.type === "ready") {
        setReady();

        return;
      }

      setError(
        (message.reason && ERROR_MESSAGES[message.reason]) ??
          UNKNOWN_ERROR_MESSAGE,
      );
    },
    [pushFrame, setReady, setError],
  );

  if (error) {
    return (
      <Center>
        <Notice>{error}</Notice>
      </Center>
    );
  }

  return (
    <Preview
      ref={webViewRef}
      source={{ html: HOLISTIC_WEB_VIEW_HTML, baseUrl: WEB_VIEW_ORIGIN }}
      onMessage={handleMessage}
      originWhitelist={["*"]}
      javaScriptEnabled
      domStorageEnabled
      // 카메라는 사용자가 버튼을 누르기 전에 떠 있어야 한다.
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      // Expo Go가 이미 카메라 권한을 받아두므로 안에서 다시 묻지 않는다.
      mediaCapturePermissionGrantType="grant"
      scrollEnabled={false}
      bounces={false}
    />
  );
}

const Preview = styled(WebView)`
  width: 100%;
  height: 100%;
  background-color: ${colors.neutral800};
`;

const Center = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Notice = styled.Text`
  color: ${colors.neutral0};
  font-size: 13px;
  line-height: 19px;
  text-align: center;
`;
