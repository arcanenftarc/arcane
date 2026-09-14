import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth/session";
import { upsertApplicant } from "@/lib/sheets";
import { verifyQuest } from "@/lib/auth/xQuests";

const ids = new Set(siteConfig.whitelistSteps.map((step) => step.id));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;
  if (!id || !ids.has(id as (typeof siteConfig.whitelistSteps)[number]["id"])) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const quest = id as (typeof siteConfig.whitelistSteps)[number]["id"];
  const ok = await verifyQuest(quest);
  if (ok) {
    const session = await getSession();
    if (session) {
      await upsertApplicant({ username: session.username, quest });
    }
  }
  return NextResponse.json({ ok });
}
