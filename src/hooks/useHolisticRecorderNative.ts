import type { HolisticFrame } from "@/apis/studySocket/type";
import { MIRROR_BEFORE_DETECTION } from "@/constants/holistic";
import { extractHolisticFrame } from "@/modules/holistic-landmarks";
import {
  resampleFrames,
  type TimedHolisticFrame,
} from "@/utils/holisticFrames";
import { useCallback, useRef, useState } from "react";
import { useFrameProcessor } from "react-native-vision-camera";
import { Worklets, useSharedValue } from "react-native-worklets-core";

/**
 * 노리는 촬영 간격.
 *
 * 감지가 한 장에 수십 ms씩 걸려서 이 간격을 다 지키지는 못한다.
 * 서버는 이웃 프레임의 좌표 차이로 속도를 보므로, 실제로 벌어진
 * 간격은 찍힌 시각을 들고 가서 보낼 때 resampleFrames가 바로잡는다.
 */
const CAPTURE_INTERVAL_MS = 1000 / 30;

/** 메시지가 지나치게 커지지 않도록 둔 상한. 5초 분량이다. */
const MAX_FRAMES = 150;

export const useHolisticRecorderNative = () => {
  const framesRef = useRef<TimedHolisticFrame[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  const isRecordingValue = useSharedValue(false);
  const lastCapturedAtValue = useSharedValue(0);

  const collectFrame = Worklets.createRunOnJS(
    (frame: HolisticFrame, at: number) => {
      if (framesRef.current.length >= MAX_FRAMES) return;

      framesRef.current.push({ frame, at });
      setFrameCount(framesRef.current.length);
    },
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (!isRecordingValue.value) return;

      const now = Date.now();

      if (now - lastCapturedAtValue.value < CAPTURE_INTERVAL_MS) return;

      lastCapturedAtValue.value = now;

      const holistic = extractHolisticFrame(frame, MIRROR_BEFORE_DETECTION);

      // 포즈를 못 잡은 장은 보내도 0으로 채워질 뿐이라 건너뛴다.
      if (!holistic || holistic.pose.length === 0) return;

      collectFrame(holistic, now);
    },
    [collectFrame],
  );

  const start = useCallback(() => {
    framesRef.current = [];
    lastCapturedAtValue.value = 0;
    isRecordingValue.value = true;

    setFrameCount(0);
    setIsRecording(true);
  }, [isRecordingValue, lastCapturedAtValue]);

  /** 녹화를 멈추고 간격을 고르게 맞춘 프레임을 돌려준다. */
  const stop = useCallback(() => {
    isRecordingValue.value = false;
    setIsRecording(false);

    return resampleFrames(framesRef.current);
  }, [isRecordingValue]);

  const reset = useCallback(() => {
    framesRef.current = [];
    setFrameCount(0);
  }, []);

  return { frameProcessor, isRecording, frameCount, start, stop, reset };
};
