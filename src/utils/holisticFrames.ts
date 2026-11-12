import {
  HAND_LANDMARK_COUNT,
  POSE_LANDMARK_COUNT,
  TARGET_FRAME_COUNT,
  type HolisticFrame,
} from "@/apis/studySocket/type";

export interface TimedHolisticFrame {
  frame: HolisticFrame;
  /** 한 녹화 안에서만 비교하는 상대 시각(ms). 서버로는 보내지 않는다. */
  at: number;
}

/**
 * 서버는 포즈 33개, 손은 21개 아니면 빈 배열을 전제한다.
 * 개수가 어긋난 채로 보내면 좌표가 밀려 읽히므로,
 * 포즈가 모자란 장은 버리고 손만 모자라면 그 손을 없는 것으로 둔다.
 */
const sanitizeFrames = (timed: TimedHolisticFrame[]): TimedHolisticFrame[] =>
  timed
    .filter(({ frame }) => frame.pose.length === POSE_LANDMARK_COUNT)
    .map(({ frame, at }) => ({
      at,
      frame: {
        pose: frame.pose,
        left: frame.left.length === HAND_LANDMARK_COUNT ? frame.left : [],
        right: frame.right.length === HAND_LANDMARK_COUNT ? frame.right : [],
      },
    }));

/**
 * 모아둔 프레임을 녹화 구간에 고르게 놓인 시각으로 다시 고른다.
 *
 * 감지가 한 장에 수십 ms씩 걸려서 실제 촬영 간격은 고르지 않다.
 * 서버는 초가 아니라 이웃 프레임의 좌표 차이로 속도를 보므로,
 * 간격이 들쭉날쭉하면 같은 동작도 매번 다른 속도로 읽힌다.
 * 보낼 때 찍힌 시각을 기준으로 다시 골라 간격을 맞춘다.
 *
 * 좌표를 섞으면 한 손만 잡힌 장에서 없는 손을 만들어내게 되므로
 * 보간하지 않고 그 시각에 가장 가까운 장을 그대로 고른다.
 */
export const resampleFrames = (
  input: TimedHolisticFrame[],
  count = TARGET_FRAME_COUNT,
): HolisticFrame[] => {
  const timed = sanitizeFrames(input);

  // 두 장 아래로는 간격이라는 게 없다. 그대로 넘기고 서버 판단에 맡긴다.
  if (timed.length < 2 || count < 2) return timed.map(({ frame }) => frame);

  const start = timed[0].at;
  const span = timed[timed.length - 1].at - start;

  // 시각이 같거나 거꾸로 들어왔으면 믿을 수 없으니 등분 인덱스로만 고른다.
  if (!(span > 0)) {
    return Array.from(
      { length: count },
      (_, index) =>
        timed[Math.round((index * (timed.length - 1)) / (count - 1))].frame,
    );
  }

  const picked: HolisticFrame[] = [];
  // timed도 격자도 시간순으로 커지기만 하므로 커서를 되돌릴 일이 없다.
  let cursor = 0;

  for (let index = 0; index < count; index += 1) {
    const target = start + (span * index) / (count - 1);

    while (
      cursor + 1 < timed.length &&
      Math.abs(timed[cursor + 1].at - target) <=
        Math.abs(timed[cursor].at - target)
    ) {
      cursor += 1;
    }

    picked.push(timed[cursor].frame);
  }

  return picked;
};
