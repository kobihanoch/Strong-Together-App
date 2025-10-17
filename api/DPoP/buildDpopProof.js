import { p256 } from "@noble/curves/p256";
import { sha256 } from "@noble/hashes/sha256";
import { base64url } from "@scure/base";
import ensureDpopKeyPair from "./ensureDpopKeyPair";

const enc = (s) => new TextEncoder().encode(s);

// Safe base64url.encode (requires Uint8Array)
const b64u = (bytes) => {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("base64url.encode expects Uint8Array");
  }
  return base64url.encode(bytes);
};

// Convert base64url string to Uint8Array
const b64uToBytes = (s) => base64url.decode(s);

// Ensure value is Uint8Array
const toU8 = (v) => (v instanceof Uint8Array ? v : Uint8Array.from(v));

function makeJti() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Build a DPoP proof (compact JWS) using noble (no WebCrypto)
 */
export default async function buildDpopProof(htm, htu) {
  const { privateJwk, publicJwk } = await ensureDpopKeyPair();

  // 1) Protected header and payload
  const header = {
    alg: "ES256",
    typ: "dpop+jwt",
    jwk: publicJwk,
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    jti: makeJti(),
    htm: (htm || "GET").toUpperCase(),
    htu,
    iat: now,
  };

  // 2) JWS signing input
  const hB64 = b64u(enc(JSON.stringify(header)));
  const pB64 = b64u(enc(JSON.stringify(payload)));
  const signingInput = `${hB64}.${pB64}`;
  const signingInputBytes = enc(signingInput);

  // 3) Hash + ECDSA-P256 sign
  const digest = sha256(signingInputBytes);

  // IMPORTANT: force raw (r||s) 64-byte signature, not DER
  const privScalar = b64uToBytes(privateJwk.d); // 32-byte scalar
  let sig = p256.sign(digest, privScalar, { der: false });
  // Some noble versions may return a Signature object; normalize to Uint8Array
  if (!(sig instanceof Uint8Array)) {
    // try compact export if available, otherwise coerce
    sig =
      typeof sig.toCompactRawBytes === "function"
        ? sig.toCompactRawBytes()
        : toU8(sig);
  }

  const sB64 = b64u(sig);

  // 4) Compact JWS
  return `${signingInput}.${sB64}`;
}
