import { sha256 } from "@noble/hashes/sha256";
import ensureDpopKeyPair from "./ensureDpopKeyPair";
import { base64url } from "@scure/base";

export default async function calculateJKT() {
  const { publicJwk } = await ensureDpopKeyPair();
  const canonicalJwk = JSON.stringify({
    crv: publicJwk.crv,
    kty: publicJwk.kty,
    x: publicJwk.x,
    y: publicJwk.y,
  });

  const hash = sha256(new TextEncoder().encode(canonicalJwk));

  return base64url
    .encode(hash)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
