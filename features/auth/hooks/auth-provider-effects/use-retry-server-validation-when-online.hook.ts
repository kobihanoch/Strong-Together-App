import React, { useEffect } from 'react';
import { useNetworkStatus } from '../../../../shared/hooks/use-network-status.hook';

/**
 * Retries a previously attempted server validation when connectivity returns,
 * while avoiding retries before startup validation or after successful validation.
 *
 * @param isValidatedWithServer - Whether the current cached session is already server-confirmed.
 * @param attemptServerValidation - Async validation operation owned by AuthProvider.
 * @param attemptedServerValidationRef - Guard indicating startup validation has completed once.
 * @returns Nothing; connectivity changes drive the validation effect.
 */
const useRetryServerValidationWhenOnline = (
  isValidatedWithServer: boolean,
  attemptServerValidation: () => Promise<void>,
  attemptedServerValidationRef: React.RefObject<boolean>,
) => {
  // --- Offline mode supportings ---
  const isOnline = useNetworkStatus();

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isValidatedWithServer && attemptedServerValidationRef.current && isOnline) {
        await attemptServerValidation();
      }
    })();
  }, [isValidatedWithServer, isOnline, attemptServerValidation, attemptedServerValidationRef]);

  return;
};

export default useRetryServerValidationWhenOnline;
