/* eslint-disable @typescript-eslint/no-require-imports */
// global.js
import QuickCrypto from 'react-native-quick-crypto';
import 'react-native-url-polyfill/auto';

// Ensure polyfills are attached to the single global realm before 'jose' loads
global.Buffer = global.Buffer || require('buffer').Buffer;
global.crypto = QuickCrypto.webcrypto as unknown as Crypto; // the WebCrypto engine used everywhere
global.CryptoKey = QuickCrypto.webcrypto.CryptoKey as unknown as typeof global.CryptoKey; // class reference used by the engine

require('react-native-get-random-values');

// Do NOT assign global.SubtleCrypto constructor. Not needed and can confuse type checks.
console.log('✅ Polyfills ready: Buffer, crypto, CryptoKey');
