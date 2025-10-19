import { SignJWT } from "jose";
import calculateATH from "./calculateATH";
import ensureDpopKeyPair from "./ensureDpopKeyPair";
import { v4 as uuidv4 } from "uuid";

export default async function buildDpopProof(htm, htu, at = null) {
  try {
    // 1) Load persisted JWKs (not CryptoKeys)
    const { privateJwk, publicJwk } = await ensureDpopKeyPair();

    // 2) Hand JWK directly to jose; add 'alg'/'use' to be explicit
    const privateJwkForJose = {
      ...privateJwk,
      alg: "ES256",
      use: "sig",
      // key_ops already includes ["sign"] from your export; leaving it is fine
    };

    // If request used for authenticated users
    const ath = calculateATH(at);

    // 3) Claims
    const payload = {
      jti: uuidv4(), // random-enough ID; ok for DPoP
      htm: (htm || "GET").toUpperCase(),
      htu: htu, // absolute URL
      iat: Math.floor(Date.now() / 1000),
    };

    if (ath) payload.ath = ath;

    // 4) Protected header (embed public JWK per spec)
    const protectedHeader = {
      alg: "ES256",
      typ: "dpop+jwt",
      jwk: publicJwk,
    };

    // 5) Sign using the JWK directly (no realm mismatch)
    return await new SignJWT(payload)
      .setProtectedHeader(protectedHeader)
      .sign(privateJwkForJose);
  } catch (err) {
    console.error("[DPoP buildDpopProof] error:", err);
    throw err;
  }
}
