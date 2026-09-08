import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../../../infrastructure/socket';
import { useTimeZoneSync } from '../../../shared/hooks/use-time-zone-sync.hook';
import { useUser } from '../../user/hooks/use-user.hook';
import { useAuth } from '../providers/AuthProvider';
import { setUsernameInHeader } from '../utils/auth.utils';
import { registerToMessagesListener } from '../../messages/messages.listeners';
import { useMessages } from '../../messages/hooks/use-messages.hook';

/** Runs app-wide effects that require both an authenticated session and user profile. */
const AuthenticatedUserEffects = () => {
  const { isValidatedWithServer } = useAuth();
  const { data: user } = useUser();
  const {
    actions: { updateLocalMessages },
  } = useMessages();

  // Sync timezone with user reminder if timezone changes
  useTimeZoneSync();

  // Connect to websocket in validation with server
  // Register messages listener
  useEffect(() => {
    if (!isValidatedWithServer || !user?.username) return;

    let cancelled = false;
    let removeMessageListener: (() => void) | undefined;

    const start = async () => {
      // Socket connection
      const connectedSocket = await connectSocket({ id: user.id, username: user.username });

      if (cancelled || !connectedSocket) return;

      // Initial listeners registration
      removeMessageListener = registerToMessagesListener(connectedSocket, updateLocalMessages);
    };

    void start().catch((error) => {
      if (!cancelled) console.error('[WebSocket]: Connection failed', error);
    });

    return () => {
      cancelled = true;
      removeMessageListener?.();
      disconnectSocket();
    };
  }, [isValidatedWithServer, user?.id, user?.username, updateLocalMessages]);

  // Set username in API headers
  useEffect(() => {
    if (user?.username) setUsernameInHeader(user?.username);
  }, [user?.username]);

  return null;
};

export default AuthenticatedUserEffects;
