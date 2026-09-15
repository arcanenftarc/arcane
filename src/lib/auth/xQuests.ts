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

const TWEET_FIELDS = "author_id,text,referenced_tweets,conversation_id,entities,in_reply_to_user_id";

function tweetList(body: XBody | null) {
  const data = body?.data;
  if (Array.isArray(data)) {
    return data.map(asRecord).filter((tweet): tweet is Record<string, unknown> => Boolean(tweet));
  }
  const one = asRecord(data);
  return one ? [one] : [];
}

function referenced(tweet: Record<string, unknown>) {
  const raw = tweet.referenced_tweets;
  if (!Array.isArray(raw)) {
    return [] as { type: string; id: string }[];
  }
  return raw
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map((item) => ({ type: String(item.type ?? ""), id: String(item.id ?? "") }));
}

function citesTweet(tweet: Record<string, unknown>, type: "replied_to" | "quoted") {
  return referenced(tweet).some((ref) => ref.type === type && ref.id === QUEST_TWEET_ID);
}

function tweetTextBlob(tweet: Record<string, unknown>) {
  const entities = asRecord(tweet.entities);
  const urls = Array.isArray(entities?.urls) ? entities.urls : [];
  const fromUrls = urls
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .flatMap((item) => [item.expanded_url, item.unwound_url, item.display_url, item.url]);
  return [tweet.text, ...fromUrls].map((value) => String(value ?? "")).join(" ");
}

function mentionsQuestPost(tweet: Record<string, unknown>) {
  return tweetTextBlob(tweet).includes(`/status/${QUEST_TWEET_ID}`);
}

function isOwn(tweet: Record<string, unknown>, userId: string) {
  const author = String(tweet.author_id ?? "");
  return !author || author === userId;
}

function isCommentOnQuest(tweet: Record<string, unknown>, userId: string, conversationId: string) {
  if (!isOwn(tweet, userId) || String(tweet.id ?? "") === QUEST_TWEET_ID) {
    return false;
  }
  if (citesTweet(tweet, "replied_to")) {
    return true;
  }
  const conversation = String(tweet.conversation_id ?? "");
  const replied = referenced(tweet).some((ref) => ref.type === "replied_to");
  return replied && (conversation === QUEST_TWEET_ID || conversation === conversationId);
}

function isQuoteOfQuest(tweet: Record<string, unknown>, userId: string) {
  if (!isOwn(tweet, userId) || String(tweet.id ?? "") === QUEST_TWEET_ID) {
    return false;
  }
  if (citesTweet(tweet, "quoted")) {
    return true;
  }
  return mentionsQuestPost(tweet) && !citesTweet(tweet, "replied_to");
}

async function paginateTweets(
  path: string,
  access: string,
  pages: number,
  extra: Record<string, string> = {},
) {
  const found: Record<string, unknown>[] = [];
  let page: string | undefined;
  let pageSize = "100";
  for (let i = 0; i < pages; i += 1) {
    const params = new URLSearchParams({
      "tweet.fields": TWEET_FIELDS,
      ...extra,
      max_results: pageSize,
    });
    if (page) {
      params.set("pagination_token", page);
    }
    const result = await xFetch(`https://api.twitter.com/2${path}?${params.toString()}`, access);
    if (result.status === 400 && pageSize === "100") {
      pageSize = "10";
      i -= 1;
      continue;
    }
    found.push(...tweetList(result.body));
    page = result.body?.meta?.next_token;
    if (!page || result.status === 429 || result.status >= 400) {
      break;
    }
  }
  return found;
}

async function searchOwn(query: string, access: string) {
  const params = new URLSearchParams({
    query,
    max_results: "100",
    "tweet.fields": TWEET_FIELDS,
  });
  const result = await xFetch(`https://api.twitter.com/2/tweets/search/recent?${params.toString()}`, access);
  if (result.status === 400 && query.length > 0) {
    params.set("max_results", "10");
    const retry = await xFetch(`https://api.twitter.com/2/tweets/search/recent?${params.toString()}`, access);
    return tweetList(retry.body);
  }
  return tweetList(result.body);
}

async function userTweets(userId: string, access: string) {
  return paginateTweets(`/users/${userId}/tweets`, access, 10, { expansions: "referenced_tweets.id,author_id" });
}

async function questConversationId(access: string) {
  const result = await xFetch(
    `https://api.twitter.com/2/tweets/${QUEST_TWEET_ID}?tweet.fields=conversation_id,author_id`,
    access,
  );
  const conversation = asRecord(result.body?.data)?.conversation_id;
  return typeof conversation === "string" && conversation ? conversation : QUEST_TWEET_ID;
}

async function searchDidAction(access: string, match: (tweet: Record<string, unknown>) => boolean, queries: string[]) {
  for (const query of queries) {
    const tweets = await searchOwn(query, access);
    if (tweets.some(match)) {
      return true;
    }
    const scoped =
      query.includes(`in_reply_to_tweet_id:${QUEST_TWEET_ID}`) ||
      query.includes(`quoted_tweet_id:${QUEST_TWEET_ID}`) ||
      query.includes(`conversation_id:`) ||
      query.includes(`/status/${QUEST_TWEET_ID}`) ||
      query.includes(`url:${QUEST_TWEET_ID}`);
    if (scoped && tweets.length > 0) {
      return true;
    }
  }
  return false;
}

async function didComment(userId: string, username: string, access: string) {
  const handle = username.replace(/^@/, "");
  const [conversationId, tweets] = await Promise.all([questConversationId(access), userTweets(userId, access)]);
  const match = (tweet: Record<string, unknown>) => isCommentOnQuest(tweet, userId, conversationId);
  if (tweets.some(match)) {
    return true;
  }

  return searchDidAction(access, match, [
    `in_reply_to_tweet_id:${QUEST_TWEET_ID} from:${userId}`,
    `in_reply_to_tweet_id:${QUEST_TWEET_ID} from:${handle}`,
    `conversation_id:${conversationId} from:${userId} is:reply`,
    `conversation_id:${QUEST_TWEET_ID} from:${userId} is:reply`,
    `conversation_id:${conversationId} from:${handle} is:reply`,
    `to:${FOLLOW_HANDLE} conversation_id:${conversationId} from:${handle}`,
  ]);
}

async function quotedByUser(userId: string, access: string) {
  let page: string | undefined;
  let pageSize = "100";
  for (let i = 0; i < 8; i += 1) {
    const params = new URLSearchParams({
      max_results: pageSize,
      "tweet.fields": TWEET_FIELDS,
      expansions: "author_id",
    });
    if (page) {
      params.set("pagination_token", page);
    }
    const result = await xFetch(
      `https://api.twitter.com/2/tweets/${QUEST_TWEET_ID}/quote_tweets?${params.toString()}`,
      access,
    );
    if (result.status === 400 && pageSize === "100") {
      pageSize = "10";
      i -= 1;
      continue;
    }
    const tweets = tweetList(result.body);
    const authors = result.body?.includes?.users ?? [];
    if (tweets.some((tweet) => String(tweet.author_id ?? "") === userId)) {
      return true;
    }
    if (authors.some((user) => userIdOf(user) === userId)) {
      return true;
    }
    page = result.body?.meta?.next_token;
    if (!page || result.status === 429 || result.status >= 400) {
      break;
    }
  }
  return false;
}

async function didQuote(userId: string, username: string, access: string) {
  const handle = username.replace(/^@/, "");
  const match = (tweet: Record<string, unknown>) => isQuoteOfQuest(tweet, userId);
  const [quoted, tweets] = await Promise.all([quotedByUser(userId, access), userTweets(userId, access)]);
  if (quoted) {
    return true;
  }
  if (tweets.some(match)) {
    return true;
  }

  return searchDidAction(access, match, [
    `quoted_tweet_id:${QUEST_TWEET_ID} from:${userId}`,
    `quoted_tweet_id:${QUEST_TWEET_ID} from:${handle}`,
    `url:${QUEST_TWEET_ID} from:${userId} is:quote`,
    `url:${QUEST_TWEET_ID} from:${handle}`,
    `url:"x.com/${FOLLOW_HANDLE}/status/${QUEST_TWEET_ID}" from:${handle}`,
    `url:"twitter.com/${FOLLOW_HANDLE}/status/${QUEST_TWEET_ID}" from:${handle}`,
  ]);
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
  if (id === "comment") {
    return didComment(session.id, session.username, access);
  }
  if (id === "retweet") {
    return didQuote(session.id, session.username, access);
  }
  return false;
}
