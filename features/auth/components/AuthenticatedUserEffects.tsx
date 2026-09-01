import { useEffect } from 'react';
import { useUser } from '../../user/hooks/use-user.hook';
import { useAuth } from '../providers/AuthProvider';
import { connectSocket } from '../../../infrastructure/socket';
import GlobalAuth from '../utils/auth.utils';

/** Runs app-wide effects that require both an authenticated session and user profile. */
const AuthenticatedUserEffects = () => {
  const { isValidatedWithServer } = useAuth();
  const { data: user } = useUser();
  const username = user?.username;

  useEffect(() => {
    if (isValidatedWithServer && username) {
      void connectSocket(username);
    }
  }, [isValidatedWithServer, username]);

  useEffect(() => {
    GlobalAuth.setUsernameInHeader(username ?? null);
  }, [username]);

  return null;
};

export default AuthenticatedUserEffects;
