import { useEffect } from 'react';
import { connectSocket } from '../../../../infrastructure/socket';
import { AppUser } from '../types/auth.types';

const useAuthSocketInitialization = (username: AppUser['username'] | undefined, isValidatedWithServer: boolean) => {
  useEffect(() => {
    if (isValidatedWithServer && username) {
      connectSocket(username);
    }
  }, [isValidatedWithServer, username]);
};

export default useAuthSocketInitialization;
