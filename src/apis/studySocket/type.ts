export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface HolisticFrame {
  pose: Landmark[];
  left: Landmark[];
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
  "INVALID_TICKET" | "NO_LANDMARKS" | (string & {});

export interface SocketErrorMessage {
  type: "error";
  code: StudySocketErrorCode;
  message: string;
}

export type ServerMessage = SessionMessage | ResultMessage | SocketErrorMessage;

export const POSE_LANDMARK_COUNT = 33;
export const HAND_LANDMARK_COUNT = 21;
