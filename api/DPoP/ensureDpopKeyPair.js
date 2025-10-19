// api/DPoP/ensureDpopKeyPair.js
import * as SecureStore from "expo-secure-store";
import { generateKeyPair } from "jose";

const PRIV_JWK_KEY = "dpop_private_jwk";
const PUB_JWK_KEY = "dpop_public_jwk";

let _cached = null;

/**
 * Ensures a persistent ES256 key pair for DPoP.
 * - Uses jose.generateKeyPair("ES256") which relies on global.crypto (polyfilled).
 * - Exports JWKs via crypto.subtle.exportKey to avoid class/realm mismatches.
 * - Persists only JWKs; import them later when you need CryptoKey objects.
 */
export default async function ensureDpopKeyPair() {
  try {
    if (_cached) return _cached;
    // 1) Try to load from storage (do NOT delete here)
    const [privJson, pubJson] = await Promise.all([
      SecureStore.getItemAsync(PRIV_JWK_KEY),
      SecureStore.getItemAsync(PUB_JWK_KEY),
    ]);

    if (privJson && pubJson) {
      const privateJwk = JSON.parse(privJson);
      const publicJwk = JSON.parse(pubJson);
      _cached = { privateJwk, publicJwk };
      return _cached;
    }

    // 2) Generate new keys (extractable so we can export JWKs)
    const { publicKey, privateKey } = await generateKeyPair("ES256", {
      extractable: true,
    });

    // 3) Export JWKs via the SAME engine that created the keys (no realm mismatch)
    const privateJwk = await global.crypto.subtle.exportKey("jwk", privateKey);
    const publicJwk = await global.crypto.subtle.exportKey("jwk", publicKey);

    // 4) Persist
    await Promise.all([
      SecureStore.setItemAsync(PRIV_JWK_KEY, JSON.stringify(privateJwk)),
      SecureStore.setItemAsync(PUB_JWK_KEY, JSON.stringify(publicJwk)),
    ]);

    _cached = { privateJwk, publicJwk };
    return _cached;
  } catch (e) {
    console.error(e);
  }
}
