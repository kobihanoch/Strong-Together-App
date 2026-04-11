// Purpose: Global Jest setup for React Native + Expo projects.
// - Extends jest-native matchers.
// - Silences noisy console logs in tests.
// - Mocks problematic native helpers.
//
// IMPORTANT: add this file path to "jest.setupFiles" in package.json.

import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

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
