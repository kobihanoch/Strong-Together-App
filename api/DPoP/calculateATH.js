// English comments only inside the code

import { sha256 } from "@noble/hashes/sha256";
import { base64url } from "@scure/base";

/**
 * Computes the DPoP "ath" (Access Token Hash)
 * according to RFC 9449.
 * - Input: accessToken (string)
 * - Output: base64url(SHA256(accessToken))
 */
export default function calculateATH(accessToken) {
  if (!accessToken) {
    return null;
  }

  // Step 1: UTF-8 encode the token
  const tokenBytes = new TextEncoder().encode(accessToken);

  // Step 2: Compute SHA-256 hash
  const hash = sha256(tokenBytes);

  // Step 3: Base64url encode the hash (no padding)
  const base64UrlAth = base64url
    .encode(hash)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64UrlAth;
}
