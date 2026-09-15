import { siteConfig } from "@/config/site";
import { getSession, getTokens, setTokens, type XTokens } from "@/lib/auth/session";

type QuestId = (typeof siteConfig.whitelistSteps)[number]["id"];
const QUEST_TWEET_ID = siteConfig.social.questTweetId;
const FOLLOW_HANDLE = siteConfig.social.xHandle.toLowerCase();

type XBody = {
  data?: unknown;
  includes?: { users?: unknown[] };
  meta?: { next_token?: string };
  relationship?: { source?: { following?: boolean } };
  errors?: unknown;
};

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

async function xFetch(url: string, access: string): Promise<{ status: number; body: XBody | null }> {
  const run = async (token: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await res.json().catch(() => null)) as XBody | null;
    return { status: res.status, body };
  };

  let result = await run(access);
  if (result.status === 401) {
    const tokens = await getTokens();
    if (tokens) {
      const refreshed = await refreshTokens(tokens);
      if (refreshed?.access) {
        result = await run(refreshed.access);
      }
    }
  }
  return result;
}

async function xGet<T>(path: string, access: string) {
  const result = await xFetch(`https://api.twitter.com/2${path}`, access);
  if (result.status < 200 || result.status >= 300) {
    return null;
  }
  return result.body as T;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function connectionOf(value: unknown): string[] {
  const record = asRecord(value);
  const raw = record?.connection_status;
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).toLowerCase());
  }
  if (typeof raw === "string") {
    return [raw.toLowerCase()];
  }
  return [];
}

function isFollowConnection(value: unknown) {
  return connectionOf(value).includes("following");
}

function userIdOf(value: unknown) {
  const id = asRecord(value)?.id;
  return typeof id === "string" ? id : "";
}

function usernameOf(value: unknown) {
  const username = asRecord(value)?.username;
  return typeof username === "string" ? username.toLowerCase() : "";
}

function isTargetUser(value: unknown, targetId?: string) {
  if (targetId && userIdOf(value) === targetId) {
    return true;
  }
  return usernameOf(value) === FOLLOW_HANDLE;
}

async function recentTweets(userId: string, access: string) {
  const data = await xGet<{
    data?: { text?: string; referenced_tweets?: { type: string; id: string }[] }[];
  }>(`/users/${userId}/tweets?max_results=100&tweet.fields=text,referenced_tweets`, access);
  return data?.data ?? [];
}

function citesTweet(
  tweets: { referenced_tweets?: { type: string; id: string }[] }[],
  type: "replied_to" | "quoted",
) {
  return tweets.some((tweet) =>
    tweet.referenced_tweets?.some((ref) => ref.type === type && ref.id === QUEST_TWEET_ID),
  );
}

async function searchOwn(query: string, access: string) {
  const data = await xGet<{ data?: { id?: string }[] }>(
    `/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10`,
    access,
  );
  return Boolean(data?.data?.length);
}

async function paginateUsers(path: string, access: string, pages: number, match: (user: unknown) => boolean) {
  let page: string | undefined;
  let pageSize = "1000";
  for (let i = 0; i < pages; i += 1) {
    const params = new URLSearchParams({ max_results: pageSize, "user.fields": "username" });
    if (page) {
      params.set("pagination_token", page);
    }
    const result = await xFetch(`https://api.twitter.com/2${path}?${params.toString()}`, access);
    if (result.status === 400 && pageSize === "1000") {
      pageSize = "100";
      i -= 1;
      continue;
    }
    const users = result.body?.data;
    const list = Array.isArray(users) ? users : [];
    if (list.some(match)) {
      return true;
    }
    page = result.body?.meta?.next_token;
    if (!page || result.status === 429) {
      break;
    }
  }
  return false;
}

async function isFollowing(userId: string, access: string) {
  const tweetAuthor = await xFetch(
    `https://api.twitter.com/2/tweets/${QUEST_TWEET_ID}?expansions=author_id&user.fields=id,username,connection_status`,
    access,
  );
  const fromTweet = tweetAuthor.body?.includes?.users ?? [];
  if (fromTweet.some((user) => isTargetUser(user) && isFollowConnection(user))) {
    return true;
  }

  const byUsername = await xFetch(
    `https://api.twitter.com/2/users/by/username/${siteConfig.social.xHandle}?user.fields=id,username,connection_status`,
    access,
  );
  const targetUser = asRecord(byUsername.body?.data) ?? asRecord(fromTweet.find((user) => isTargetUser(user)));
  if (isFollowConnection(targetUser)) {
    return true;
  }

  const targetId = userIdOf(targetUser) || fromTweet.map(userIdOf).find(Boolean);
  if (targetId && targetId === userId) {
    return true;
  }

  if (targetId) {
    const byId = await xFetch(
      `https://api.twitter.com/2/users/${targetId}?user.fields=id,username,connection_status`,
      access,
    );
    if (isFollowConnection(byId.body?.data)) {
      return true;
    }

    const batch = await xFetch(
      `https://api.twitter.com/2/users?ids=${encodeURIComponent(targetId)}&user.fields=id,username,connection_status`,
      access,
    );
    const batchUsers = Array.isArray(batch.body?.data) ? batch.body.data : [];
    if (batchUsers.some(isFollowConnection)) {
      return true;
    }

    const rel = await xFetch(`https://api.twitter.com/2/users/${userId}/following/${targetId}`, access);
    if (rel.status === 200 && (userIdOf(rel.body?.data) === targetId || isFollowConnection(rel.body?.data))) {
      return true;
    }

    const friendships = await xFetch(
      `https://api.twitter.com/1.1/friendships/show.json?source_id=${encodeURIComponent(userId)}&target_id=${encodeURIComponent(targetId)}`,
      access,
    );
    if (friendships.body?.relationship?.source?.following) {
      return true;
    }

    if (
      await paginateUsers(`/users/${targetId}/followers`, access, 8, (user) => userIdOf(user) === userId)
    ) {
      return true;
    }
  }

  return paginateUsers(`/users/${userId}/following`, access, 20, (user) => isTargetUser(user, targetId));
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

  const tweets = await recentTweets(session.id, access);
  if (id === "comment") {
    if (citesTweet(tweets, "replied_to")) {
      return true;
    }
    return searchOwn(`conversation_id:${QUEST_TWEET_ID} from:${session.username}`, access);
  }
  if (id === "retweet") {
    if (citesTweet(tweets, "quoted")) {
      return true;
    }
    return searchOwn(`quoted_tweet_id:${QUEST_TWEET_ID} from:${session.username}`, access);
  }
  return false;
}
