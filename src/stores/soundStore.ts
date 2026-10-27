import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const DEFAULT_VOLUME = 0.68;

interface SoundState {
  soundEnabled: boolean;
  volume: number;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      volume: DEFAULT_VOLUME,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "sound-setting",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useEffectiveVolume = () =>
  useSoundStore((state) => (state.soundEnabled ? state.volume : 0));
