import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

export const DEFAULT_VOLUME = 0.68;

const canUseLocalStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

const webStorage: StateStorage = {
  getItem: (name) => {
    if (!canUseLocalStorage()) return null;

    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },

  setItem: (name, value) => {
    if (!canUseLocalStorage()) return;

    try {
      window.localStorage.setItem(name, value);
    } catch {
      return;
    }
  },

  removeItem: (name) => {
    if (!canUseLocalStorage()) return;

    try {
      window.localStorage.removeItem(name);
    } catch {
      return;
    }
  },
};

const soundStorage: StateStorage =
  Platform.OS === "web" ? webStorage : AsyncStorage;

interface SoundState {
  soundEnabled: boolean;
  volume: number;
  hasHydrated: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setVolume: (volume: number) => void;
}

let markHydrated: (() => void) | null = null;
let isHydrationPending = false;

const finishHydration = () => {
  if (markHydrated) {
    markHydrated();
    return;
  }

  isHydrationPending = true;
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      volume: DEFAULT_VOLUME,
      hasHydrated: false,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "sound-setting",
      storage: createJSONStorage(() => soundStorage),
      partialize: ({ soundEnabled, volume }) => ({ soundEnabled, volume }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("소리 설정을 불러오지 못했습니다:", error);
        }

        finishHydration();
      },
    },
  ),
);

markHydrated = () => useSoundStore.setState({ hasHydrated: true });

if (isHydrationPending) {
  markHydrated();
}

export const useEffectiveVolume = () =>
  useSoundStore((state) =>
    state.hasHydrated && state.soundEnabled ? state.volume : 0,
  );
