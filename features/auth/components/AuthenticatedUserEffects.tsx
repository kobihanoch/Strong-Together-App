import { useEffect } from 'react';
import { connectSocket } from '../../../infrastructure/socket';
import { useTimeZoneSync } from '../../../shared/hooks/use-time-zone-sync.hook';
import { useUser } from '../../user/hooks/use-user.hook';
import { useAuth } from '../providers/AuthProvider';
import { setUsernameInHeader } from '../utils/auth.utils';

/** Runs app-wide effects that require both an authenticated session and user profile. */
const AuthenticatedUserEffects = () => {
  const { isValidatedWithServer } = useAuth();
  const { data: user } = useUser();
  const username = user?.username;

  // Sync timezone with user reminder if timezone changes
  useTimeZoneSync();

  // Connect to websocket in validation with server
  useEffect(() => {
    if (isValidatedWithServer && username) {
      void connectSocket(username);
    }
  }, [isValidatedWithServer, username]);

  // Set username in API headers
  useEffect(() => {
    if (username) setUsernameInHeader(username);
  }, [username]);

  return null;
};

export default AuthenticatedUserEffects;
