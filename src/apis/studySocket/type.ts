export interface Landmark {
  /** 이미지 기준 정규화 좌표(0~1). 월드 좌표를 넣으면 인식이 깨진다. */
  x: number;
  y: number;
  /** 포즈는 엉덩이 중점, 손은 그 손목이 원점 */
  z: number;
  /** 포즈만 사용. presence가 아니라 visibility다. */
  visibility?: number;
}

/**
 * 서버가 기대하는 한 프레임.
 *
 * - poseLandmarks / handLandmarks를 그대로 보낸다.
 *   poseWorldLandmarks, handWorldLandmarks는 스케일이 달라 쓰면 안 된다.
 * - left, right는 화면 기준이 아니라 찍힌 사람의 왼손, 오른손이다.
 *   Hand Landmarker의 handedness는 반전된 셀카를 전제하므로 쓰지 않고,
 *   포즈 15(왼손목)에 가까운 손을 left, 16(오른손목)에 가까운 손을 right에 넣는다.
 * - 전면 카메라는 좌우 반전 전 프레임으로 검출한다.
 *   미리보기가 거울이어도 좌표를 다시 뒤집지 않는다.
 * - 손이 안 보이면 그 배열은 []로 둔다. 포즈는 33개를 채운다.
 * - 픽셀 변환, 어깨 정규화, 속도 계산은 서버가 한다.
 */
export interface HolisticFrame {
  /** 33개 */
  pose: Landmark[];
  /** 21개 또는 [] */
  left: Landmark[];
  /** 21개 또는 [] */
  right: Landmark[];
}

export interface AuthMessage {
  type: "auth";
  ticket: string;
}

export interface AttemptMessage {
  type: "attempt";
  frames: HolisticFrame[];
}

export type ClientMessage = AuthMessage | AttemptMessage;

export interface SessionMessage {
  type: "session";
  memberId: string;
  sid: number;
  date: string;
  words: string[];
  reviews: string[];
}

export interface ResultMessage {
  type: "result";
  target: string;
  predicted: string;
  confidence: number;
  correct: boolean;
  wordId: number | null;
  recorded: boolean;
  passed: boolean | null;
}

export type StudySocketErrorCode =
  | "INVALID_TICKET"
  | "NO_LANDMARKS"
  /** 서버가 보내는 코드가 아니라, close code 1009를 클라이언트가 옮긴 것 */
  | "MESSAGE_TOO_BIG"
  | (string & {});

export interface SocketErrorMessage {
  type: "error";
  code: StudySocketErrorCode;
  message: string;
}

export type ServerMessage = SessionMessage | ResultMessage | SocketErrorMessage;

export const POSE_LANDMARK_COUNT = 33;
export const HAND_LANDMARK_COUNT = 21;

/** 좌우를 가르는 기준이 되는 포즈 손목 인덱스 */
export const POSE_LEFT_WRIST_INDEX = 15;
export const POSE_RIGHT_WRIST_INDEX = 16;

/**
 * 서버가 맞추는 프레임 수.
 * 보내기 전에 resampleFrames가 이 개수로, 고른 간격으로 다시 골라 준다.
 */
export const TARGET_FRAME_COUNT = 60;
