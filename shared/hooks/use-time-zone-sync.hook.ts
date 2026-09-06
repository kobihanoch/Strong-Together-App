import { useFocusEffect } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { updateReminderTimeZone } from '../services/reminder-time-zone.service';
import { useTimeZoneStore } from '../stores/time-zone.store';
import { getClientTimeZone } from '../utils/time-zone.utils';

// Enable only after updateReminderTimeZone contains the agreed server contract.
const IS_SERVER_SYNC_ENABLED = false;

/** Detects timezone changes on navigation focus and coordinates server sync. */
export const useTimeZoneSync = (): void => {
  const timeZone = useTimeZoneStore((state) => state.timeZone);
  const hasHydrated = useTimeZoneStore((state) => state.hasHydrated);
  const setTimeZone = useTimeZoneStore((state) => state.setTimeZone);

  const syncMutation = useMutation({
    mutationFn: updateReminderTimeZone,
  });

  useFocusEffect(
    useCallback(() => {
      if (!hasHydrated) return;

      // Get current time zone
      const detectedTimeZone = getClientTimeZone();
      if (!detectedTimeZone) return;

      // If current timezone has changed from whats cached already
      if (detectedTimeZone !== timeZone) {
        // Sync with cache only
        setTimeZone(detectedTimeZone);
        // Sync with server too (reminder options)
        if (IS_SERVER_SYNC_ENABLED && !syncMutation.isPending) {
          syncMutation.mutate(detectedTimeZone);
        }
      }
    }, [hasHydrated, setTimeZone, syncMutation, timeZone]),
  );
};
