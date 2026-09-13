import { cookies } from "next/headers";

export type XSession = {
  id: string;
  username: string;
  name: string;
  avatar?: string;
};

const SESSION_COOKIE = "arcane_x";
const PKCE_COOKIE = "arcane_x_pkce";
const WEEK = 60 * 60 * 24 * 7;

function secret() {
  return process.env.X_CLIENT_SECRET || process.env.SESSION_SECRET || "";
}

async function hmac(value: string) {
  const keyMaterial = new TextEncoder().encode(secret() || "arcane-dev-session");
  const key = await crypto.subtle.importKey("raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64url(sig);
}

export function base64url(data: ArrayBuffer | Uint8Array | string) {
  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : data instanceof Uint8Array
        ? data
        : new Uint8Array(data);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64url(digest);
}

export function randomToken(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64url(buf);
}

export async function getSession(): Promise<XSession | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) {
    return null;
  }
  const expected = await hmac(payload);
  if (expected !== sig) {
    return null;
  }
  try {
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as XSession;
  } catch {
    return null;
  }
}

export async function setSession(session: XSession) {
  const payload = base64url(JSON.stringify(session));
  const sig = await hmac(payload);
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(PKCE_COOKIE);
}

export async function setPkce(state: string, verifier: string) {
  (await cookies()).set(PKCE_COOKIE, `${state}.${verifier}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function readPkce() {
  const raw = (await cookies()).get(PKCE_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  const dot = raw.indexOf(".");
  if (dot < 0) {
    return null;
  }
  return { state: raw.slice(0, dot), verifier: raw.slice(dot + 1) };
}

export function originFromHeaders(headers: Headers) {
  const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost:3000";
  const proto = headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
