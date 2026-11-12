import type { HolisticFrame } from "@/apis/studySocket/type";
import { VisionCameraProxy, type Frame } from "react-native-vision-camera";

const plugin = VisionCameraProxy.initFrameProcessorPlugin(
  "holisticLandmarks",
  {},
);

/**
 * 프레임 한 장에서 MediaPipe 정규화 좌표를 뽑는다.
 * 프레임 프로세서(워클릿) 안에서만 호출할 수 있다.
 *
 * mirror는 감지 전에 프레임을 좌우로 반전할지다.
 * 호출할 때마다 넘기므로 값을 바꿔도 다시 빌드하지 않아도 된다.
 */
export const extractHolisticFrame = (
  frame: Frame,
  mirror: boolean,
): HolisticFrame | null => {
  "worklet";

  if (!plugin) return null;

  const result = plugin.call(frame, {
    mirror,
  }) as unknown as HolisticFrame | null;

  if (!result) return null;

  return {
    pose: result.pose ?? [],
    left: result.left ?? [],
    right: result.right ?? [],
  };
};

export const isHolisticPluginAvailable = () => plugin !== null;
