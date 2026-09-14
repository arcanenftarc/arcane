import { NextResponse } from "next/server";
import { originFromHeaders, readPkce, setSession, setTokens } from "@/lib/auth/session";
import { upsertApplicant } from "@/lib/sheets";

export async function GET(request: Request) {
  const origin = originFromHeaders(request.headers);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const pkce = await readPkce();
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;

  if (!code || !state || !pkce || pkce.state !== state || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/whitelist", origin));
  }

  const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: `${origin}/api/auth/x/callback`,
      code_verifier: pkce.verifier,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/whitelist", origin));
  }

  const token = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!token.access_token) {
    return NextResponse.redirect(new URL("/whitelist", origin));
  }

  const meRes = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!meRes.ok) {
    return NextResponse.redirect(new URL("/whitelist", origin));
  }

  const me = (await meRes.json()) as {
    data?: { id: string; username: string; name: string; profile_image_url?: string };
  };
  if (!me.data) {
    return NextResponse.redirect(new URL("/whitelist", origin));
  }

  await setSession({
    id: me.data.id,
    username: me.data.username,
    name: me.data.name,
    avatar: me.data.profile_image_url,
  });
  await setTokens({
    access: token.access_token,
    exp: token.expires_in ? Date.now() + token.expires_in * 1000 : undefined,
  });
  await upsertApplicant({ username: me.data.username });
  return NextResponse.redirect(new URL("/whitelist", origin));
}
