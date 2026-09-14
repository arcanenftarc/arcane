import { createSign } from "crypto";
import { getSession } from "@/lib/auth/session";

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const HEADERS = ["username", "task 01", "task 02", "task 03", "submitted wallet"] as const;

type QuestId = "follow" | "comment" | "retweet";

const questColumn: Record<QuestId, number> = {
  follow: 1,
  comment: 2,
  retweet: 3,
};

function sheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
}

function tabName() {
  return process.env.GOOGLE_SHEETS_TAB?.trim() || "Whitelist";
}

function sheetRange(range: string) {
  const tab = tabName().replace(/'/g, "''");
  return `'${tab}'!${range}`;
}

function privateKey() {
  return (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
}

async function accessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = privateKey();
  if (!email || !key) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const assertion = `${header}.${payload}.${signer.sign(key, "base64url")}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function sheetsFetch(path: string, token: string, init?: RequestInit) {
  const id = process.env.GOOGLE_SHEETS_ID;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

async function readRows(token: string) {
  const res = await sheetsFetch(`/values/${encodeURIComponent(sheetRange("A:E"))}`, token);
  if (!res.ok) {
    return [] as string[][];
  }
  const data = (await res.json()) as { values?: string[][] };
  return data.values ?? [];
}

async function ensureHeader(token: string, rows: string[][]) {
  if (rows[0] && HEADERS.every((title, i) => (rows[0][i] || "").toLowerCase() === title)) {
    return;
  }
  await sheetsFetch(`/values/${encodeURIComponent(sheetRange("A1:E1"))}?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ values: [HEADERS] }),
  });
}

function emptyRow(username: string): string[] {
  return [username, "no", "no", "no", ""];
}

export async function upsertApplicant(update: { username: string; quest?: QuestId; wallet?: string }) {
  if (!sheetsConfigured()) {
    return false;
  }
  const token = await accessToken();
  if (!token) {
    return false;
  }

  const rows = await readRows(token);
  await ensureHeader(token, rows);

  const username = update.username.replace(/^@/, "");
  const body = rows.length && HEADERS.every((title, i) => (rows[0][i] || "").toLowerCase() === title) ? rows.slice(1) : rows;
  const index = body.findIndex((row) => (row[0] || "").replace(/^@/, "").toLowerCase() === username.toLowerCase());
  const current = index >= 0 ? [...body[index]] : emptyRow(username);
  while (current.length < 5) {
    current.push(current.length === 0 ? username : current.length < 4 ? "no" : "");
  }
  current[0] = username;
  if (update.quest) {
    current[questColumn[update.quest]] = "yes";
  }
  if (update.wallet !== undefined) {
    current[4] = update.wallet;
  }

  if (index >= 0) {
    const rowNumber = index + 2;
    const res = await sheetsFetch(
      `/values/${encodeURIComponent(sheetRange(`A${rowNumber}:E${rowNumber}`))}?valueInputOption=RAW`,
      token,
      { method: "PUT", body: JSON.stringify({ values: [current] }) },
    );
    return res.ok;
  }

  const res = await sheetsFetch(`/values/${encodeURIComponent(sheetRange("A:E"))}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, token, {
    method: "POST",
    body: JSON.stringify({ values: [current] }),
  });
  return res.ok;
}

export async function readApplicant(username: string) {
  if (!sheetsConfigured()) {
    return null;
  }
  const token = await accessToken();
  if (!token) {
    return null;
  }
  const rows = await readRows(token);
  const handle = username.replace(/^@/, "").toLowerCase();
  const row = rows.find((entry, i) => i > 0 && (entry[0] || "").replace(/^@/, "").toLowerCase() === handle);
  if (!row) {
    return { username, task01: "no", task02: "no", task03: "no", wallet: "" };
  }
  return {
    username: row[0] || username,
    task01: row[1] || "no",
    task02: row[2] || "no",
    task03: row[3] || "no",
    wallet: row[4] || "",
  };
}

export async function applicantFromSession() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return readApplicant(session.username);
}
