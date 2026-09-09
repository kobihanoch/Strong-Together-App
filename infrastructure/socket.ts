// English-only comments inside code
import { io, Socket } from 'socket.io-client';
import api from './api/api-config/api';
import { API_BASE_URL } from '../infrastructure/api/api-url.config';
import { AppUser } from '../features/user/types/user.types';
import { CreateWebSocketTicketBody, CreateWebSocketTicketResponse } from '@strong-together/shared';

let socket: Socket | null = null;
let socketOwnerId: AppUser['id'] | null = null;
let connectionGeneration = 0;

type SocketIdentity = Pick<AppUser, 'id' | 'username'>;

// Helper to mint a fresh short-lived ticket

async function mintTicket(username: AppUser['username']) {
  const res = await api.post<CreateWebSocketTicketResponse>('/api/websocket-tickets', { username } satisfies CreateWebSocketTicketBody);
  const ticket = res?.data?.ticket;
  if (!ticket) throw new Error('Failed to get socket ticket');
  return ticket;
}

async function reconnectWithFreshTicket(targetSocket: Socket, username: AppUser['username']) {
  if (socket !== targetSocket) return;
  try {
    const fresh = await mintTicket(username);
    if (socket !== targetSocket) return;
    targetSocket.auth = { ticket: fresh };
    targetSocket.connect();
  } catch (e) {
    console.error('[WebSocket]: Ticket refresh failed:', (e as Error).message || e);
  }
}

const closeCurrentSocket = (): void => {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
  socketOwnerId = null;
};

/** Connects the socket for one authenticated identity and ignores superseded attempts. */
export const connectSocket = async ({ id: userId, username }: SocketIdentity): Promise<Socket | null> => {
  if (socket?.connected && socketOwnerId === userId) return socket;

  const generation = ++connectionGeneration;
  closeCurrentSocket();
  const firstTicket = await mintTicket(username);

  // Logout or another identity became active while the ticket was being minted.
  if (generation !== connectionGeneration) return null;

  const nextSocket = io(API_BASE_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    upgrade: false,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    timeout: 15000,
    auth: { ticket: firstTicket },
  });

  socket = nextSocket;
  socketOwnerId = userId;

  nextSocket.on('connect', () => {
    console.log('[WebSocket]: Socket connected');
    nextSocket.emit('user_loggedin');
  });

  nextSocket.on('disconnect', (reason) => {
    console.log('[WebSocket]: Socket disconnected:', reason);
  });

  nextSocket.on('connect_error', (err) => {
    const msg = (err?.message || '').toLowerCase();
    if (/(missing|invalid|expired|unauth)/i.test(msg)) {
      void reconnectWithFreshTicket(nextSocket, username);
    }
  });

  nextSocket.connect();
  return nextSocket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  // Any ticket request that resolves after this point belongs to a stale session.
  connectionGeneration += 1;
  try {
    closeCurrentSocket();
  } catch (e) {
    console.log(e);
  }
};
