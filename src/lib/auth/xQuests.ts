import { siteConfig } from "@/config/site";
import { getSession, getTokens, setTokens, type XTokens } from "@/lib/auth/session";

type QuestId = (typeof siteConfig.whitelistSteps)[number]["id"];

async function refreshTokens(tokens: XTokens): Promise<XTokens | null> {
  if (!tokens.refresh) {
    return tokens;
  }
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }

  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh,
      client_id: clientId,
    }),
  });
  if (!res.ok) {
    return null;
  }
  const next = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!next.access_token) {
    return null;
  }
  const stored = {
    access: next.access_token,
    refresh: next.refresh_token || tokens.refresh,
    exp: next.expires_in ? Date.now() + next.expires_in * 1000 : undefined,
  };
  await setTokens(stored);
  return stored;
}

async function accessToken() {
  let tokens = await getTokens();
  if (!tokens?.access) {
    return null;
  }
  if (tokens.exp && tokens.exp < Date.now() + 30_000) {
    tokens = (await refreshTokens(tokens)) ?? tokens;
  }
  return tokens.access;
}

async function xGet<T>(path: string, access: string) {
  const res = await fetch(`https://api.twitter.com/2${path}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  if (res.status === 401) {
    const tokens = await getTokens();
    if (!tokens) {
      return null;
    }
    const refreshed = await refreshTokens(tokens);
    if (!refreshed) {
      return null;
    }
    const retry = await fetch(`https://api.twitter.com/2${path}`, {
      headers: { Authorization: `Bearer ${refreshed.access}` },
    });
    if (!retry.ok) {
      return null;
    }
    return (await retry.json()) as T;
  }
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as T;
}

function includesAll(text: string, parts: string[]) {
  const hay = text.toLowerCase();
  return parts.every((part) => hay.includes(part.toLowerCase()));
}

async function recentTweetTexts(userId: string, access: string) {
  const data = await xGet<{ data?: { text?: string }[] }>(
    `/users/${userId}/tweets?max_results=100&tweet.fields=text`,
    access,
  );
  return (data?.data ?? []).map((tweet) => tweet.text ?? "");
}

async function isFollowing(userId: string, access: string) {
  const handle = siteConfig.social.xHandle;
  const target = await xGet<{ data?: { id?: string; connection_status?: string[] } }>(
    `/users/by/username/${handle}?user.fields=connection_status`,
    access,
  );
  if (target?.data?.connection_status?.includes("following")) {
    return true;
  }

  const targetId = target?.data?.id;
  let page: string | undefined;
  for (let i = 0; i < 5; i += 1) {
    const params = new URLSearchParams({ max_results: "100", "user.fields": "username" });
    if (page) {
      params.set("pagination_token", page);
    }
    const following = await xGet<{
      data?: { id?: string; username?: string }[];
      meta?: { next_token?: string };
    }>(`/users/${userId}/following?${params.toString()}`, access);
    if (
      following?.data?.some(
        (user) => user.id === targetId || user.username?.toLowerCase() === handle.toLowerCase(),
      )
    ) {
      return true;
    }
    page = following?.meta?.next_token;
    if (!page) {
      break;
    }
  }
  return false;
}

export async function verifyQuest(id: QuestId) {
  const session = await getSession();
  const access = await accessToken();
  if (!session || !access) {
    return false;
  }

  if (id === "follow") {
    return isFollowing(session.id, access);
  }

  const texts = await recentTweetTexts(session.id, access);
  if (id === "comment") {
    return texts.some((text) => includesAll(text, ["the gate is opening", "arcanenft_arc"]));
  }
  if (id === "retweet") {
    return texts.some(
      (text) => includesAll(text, ["held at the threshold"]) || text.toLowerCase().includes("arcanenft.xyz"),
    );
  }
  return false;
}
