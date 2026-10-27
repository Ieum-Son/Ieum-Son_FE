import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const DEFAULT_VOLUME = 0.68;

interface SoundState {
  soundEnabled: boolean;
  volume: number;
  hasHydrated: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setVolume: (volume: number) => void;
}

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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ soundEnabled, volume }) => ({ soundEnabled, volume }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("소리 설정을 불러오지 못했습니다:", error);
        }

        useSoundStore.setState({ hasHydrated: true });
      },
    },
  ),
);

export const useEffectiveVolume = () =>
  useSoundStore((state) =>
    state.hasHydrated && state.soundEnabled ? state.volume : 0,
  );
