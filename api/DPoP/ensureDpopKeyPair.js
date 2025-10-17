import { p256 } from "@noble/curves/p256";
import { base64url } from "@scure/base";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { crypto as rnCrypto } from "react-native-webcrypto";

// 1) Polyfill: make sure globalThis.crypto/subtle exist before jose uses them
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  globalThis.crypto = rnCrypto;
}

// 2) Stable keys in SecureStore
const PRIV_KEY = "dpop_private_jwk";
const PUB_KEY = "dpop_public_jwk";

// 3) Base64url helper (no padding)
function b64u(bytes) {
  return base64url.encode(bytes);
}

// 4) Build EC P-256 JWK from 32-byte private scalar
function jwkFromPrivate(privBytes) {
  if (!(privBytes instanceof Uint8Array) || privBytes.length !== 32) {
    throw new Error("Invalid P-256 private key length");
  }
  // Uncompressed public key: 0x04 | X(32) | Y(32)
  const pubUncompressed = p256.getPublicKey(privBytes, false);
  if (pubUncompressed.length !== 65 || pubUncompressed[0] !== 0x04) {
    throw new Error("Invalid uncompressed public key");
  }
  const x = pubUncompressed.slice(1, 33);
  const y = pubUncompressed.slice(33, 65);

  return {
    kty: "EC",
    crv: "P-256",
    x: b64u(x),
    y: b64u(y),
    d: b64u(privBytes),
  };
}

// 5) Derive public JWK (drop 'd')
function publicJwkFromPrivateJwk(privJwk) {
  const { x, y } = privJwk;
  return { kty: "EC", crv: "P-256", x, y };
}

let _cached = null;

/**
 * Ensures a CryptoKey pair for DPoP, stored as JWK in SecureStore.
 * - Generate with noble (pure JS) on first run
 * - Persist as JWK (x,y,d) in SecureStore
 * - Import to CryptoKey via jose.importJWK (WebCrypto compatible)
 * Returns: { privateKey, publicKey, publicJwk }
 */
export default async function ensureDpopKeyPair() {
  try {
    if (_cached) return _cached;

    // Try load from SecureStore
    const [privJson, pubJson] = await Promise.all([
      SecureStore.getItemAsync(PRIV_KEY),
      SecureStore.getItemAsync(PUB_KEY),
    ]);

    let privJwk, pubJwk;

    if (privJson && pubJson) {
      privJwk = JSON.parse(privJson);
      pubJwk = JSON.parse(pubJson);
      console.log("[KeyPair]: Loaded from cache");
    } else {
      // Generate new P-256 private key (32-byte scalar)
      const privBytes = p256.utils.randomPrivateKey();
      privJwk = jwkFromPrivate(privBytes);
      pubJwk = publicJwkFromPrivateJwk(privJwk);

      await SecureStore.setItemAsync(PRIV_KEY, JSON.stringify(privJwk));
      await SecureStore.setItemAsync(PUB_KEY, JSON.stringify(pubJwk));
      console.log("[KeyPair]: Generated new key pair");
    }

    // Import to CryptoKey for ES256 signing/verifying
    _cached = {
      privateJwk: privJwk,
      publicJwk: pubJwk,
    };
    return _cached;
  } catch (e) {
    console.log(e);
  }
}
