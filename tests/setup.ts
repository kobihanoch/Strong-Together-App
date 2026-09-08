// Purpose: Global Jest setup for React Native + Expo projects.
// - Extends jest-native matchers.
// - Silences noisy console logs in tests.
// - Mocks problematic native helpers.
//
// IMPORTANT: add this file path to "jest.setupFiles" in package.json.

import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Native persistence is a client boundary. Keeping one in-memory implementation
// lets integration tests exercise the real providers, hooks, and stores.
const mockAsyncStorage = new Map<string, string>();
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockAsyncStorage.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => void mockAsyncStorage.set(key, value)),
    removeItem: jest.fn(async (key: string) => void mockAsyncStorage.delete(key)),
    clear: jest.fn(async () => void mockAsyncStorage.clear()),
    getAllKeys: jest.fn(async () => [...mockAsyncStorage.keys()]),
    multiGet: jest.fn(async (keys: string[]) => keys.map((key) => [key, mockAsyncStorage.get(key) ?? null])),
    multiSet: jest.fn(async (entries: [string, string][]) => entries.forEach(([key, value]) => mockAsyncStorage.set(key, value))),
    multiRemove: jest.fn(async (keys: string[]) => keys.forEach((key) => mockAsyncStorage.delete(key))),
  },
}));

const mockSecureStorage = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockSecureStorage.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => void mockSecureStorage.set(key, value)),
  deleteItemAsync: jest.fn(async (key: string) => void mockSecureStorage.delete(key)),
}));

jest.mock('expo-notifications', () => ({
  PermissionStatus: { GRANTED: 'granted' },
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => 'test-reminder'),
  cancelScheduledNotificationAsync: jest.fn(async () => undefined),
  setNotificationChannelAsync: jest.fn(async () => undefined),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('axios', () => ({
  AxiosError: class AxiosError extends Error {},
  isAxiosError: jest.fn(() => false),
}));

// Silence console.log during tests (keeps output readable)
jest.spyOn(console, 'log').mockImplementation(() => {});

jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: (v: number) => v,
}));

jest.mock('react-native-compressor', () => ({
  uuidv4: () => 'test-uuid',
  backgroundUpload: jest.fn(),
  UploaderHttpMethod: {
    PUT: 'PUT',
    POST: 'POST',
  },
  UploadType: {
    MULTIPART: 'MULTIPART',
    BINARY_CONTENT: 'BINARY_CONTENT',
  },
  Video: {
    compress: jest.fn(),
  },
  getVideoMetaData: jest.fn(),
}));

jest.mock('jose', () => ({
  generateKeyPair: jest.fn(async () => ({
    privateKey: {},
    publicKey: {},
  })),
  exportJWK: jest.fn(async () => ({ kty: 'EC' })),
  SignJWT: class {
    setProtectedHeader() {
      return this;
    }
    setJti() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setAudience() {
      return this;
    }
    setIssuer() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    async sign() {
      return 'test-dpop-proof';
    }
  },
}));

jest.mock('@noble/hashes/sha256', () => ({
  sha256: jest.fn(() => new Uint8Array([1, 2, 3, 4])),
}));

jest.mock('@scure/base', () => ({
  base64url: {
    encode: jest.fn(() => 'encoded'),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-v4'),
}));
