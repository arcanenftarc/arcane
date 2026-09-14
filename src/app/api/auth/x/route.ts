import { NextResponse } from "next/server";
import { originFromHeaders, randomToken, setPkce, sha256 } from "@/lib/auth/session";

export async function GET(request: Request) {
  const origin = originFromHeaders(request.headers);
  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/?x=setup#whitelist", origin));
  }

  const state = randomToken(16);
  const verifier = randomToken(32);
  const challenge = await sha256(verifier);
  await setPkce(state, verifier);

  const url = new URL("https://twitter.com/i/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}/api/auth/x/callback`);
  url.searchParams.set("scope", "users.read tweet.read follows.read");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(url);
}
