import React, { useEffect } from 'react';
import { useNetworkStatus } from '../../../../shared/hooks/use-network-status.hook';

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
