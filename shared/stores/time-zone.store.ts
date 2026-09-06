import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CACHE_VERSION } from '../../infrastructure/cache/cache.constants';

const TIME_ZONE_CACHE_VERSION = Number(CACHE_VERSION?.replace(/\D/g, '') ?? 0);

type TimeZoneStore = {
  timeZone: string | null;
  hasHydrated: boolean;
  setTimeZone: (timeZone: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useTimeZoneStore = create<TimeZoneStore>()(
  persist(
    (set) => ({
      // Initial
      timeZone: null,
      hasHydrated: false,

      // Methods
      setTimeZone: (timeZone) => set({ timeZone }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'TIME_ZONE_CACHE',
      version: TIME_ZONE_CACHE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ timeZone }) => ({ timeZone }),
      migrate: () => ({ timeZone: null }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

/** Returns the persisted device timezone for non-React consumers such as API services. */
export const getTimeZoneFromStore = (): string => useTimeZoneStore.getState().timeZone ?? 'UTC';
