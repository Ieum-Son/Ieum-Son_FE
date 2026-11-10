import type { HolisticFrame } from "@/apis/studySocket/type";
import {
  resampleFrames,
  type TimedHolisticFrame,
} from "@/utils/holisticFrames";
import { create } from "zustand";

/** 메시지가 지나치게 커지지 않도록 둔 상한. 5초 분량이다. */
const MAX_FRAMES = 150;

/**
 * 프레임은 30fps로 쌓인다. store 상태에 담으면 장마다 리렌더가 돈다.
 * 그래서 배열은 바깥에 두고 개수만 상태로 올린다.
 */
let frames: TimedHolisticFrame[] = [];

interface HolisticStore {
  /** WebView가 카메라와 모델을 띄웠는지 */
  isReady: boolean;
  isRecording: boolean;
  frameCount: number;
  /** 카메라나 모델을 띄우지 못한 이유. 없으면 null */
  error: string | null;
  setReady: () => void;
  setError: (message: string) => void;
  /** at은 WebView가 그 장을 찍은 시각이다. 간격을 맞출 때만 쓴다. */
  pushFrame: (frame: HolisticFrame, at: number) => void;
  start: () => void;
  stop: () => HolisticFrame[];
  reset: () => void;
}

export const useHolisticStore = create<HolisticStore>((set, get) => ({
  isReady: false,
  isRecording: false,
  frameCount: 0,
  error: null,

  setReady: () => set({ isReady: true, error: null }),

  setError: (message) =>
    set({ error: message, isReady: false, isRecording: false }),

  pushFrame: (frame, at) => {
    // WebView에 중단을 알리기까지 틈이 있어 구간 밖에서 온 장이 섞인다.
    if (!get().isRecording || frames.length >= MAX_FRAMES) return;

    frames.push({ frame, at });
    set({ frameCount: frames.length });
  },

  start: () => {
    frames = [];
    set({ isRecording: true, frameCount: 0 });
  },

  /** 녹화를 멈추고 간격을 고르게 맞춘 프레임을 돌려준다. */
  stop: () => {
    set({ isRecording: false });

    // resampleFrames가 새 배열을 만들어 주므로 따로 복사하지 않는다.
    return resampleFrames(frames);
  },

  reset: () => {
    frames = [];
    set({ frameCount: 0 });
  },
}));
