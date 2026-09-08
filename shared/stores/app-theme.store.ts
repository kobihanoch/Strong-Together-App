import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppThemeMode } from '../constants/theme';

type AppThemeStore = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
};

export const useAppThemeStore = create<AppThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'APP_THEME',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ mode }) => ({ mode }),
    },
  ),
);
