import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { applicantFromSession, upsertApplicant } from "@/lib/sheets";

const walletPattern = /^0x[a-fA-F0-9]{40}$/;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const row = await applicantFromSession();
  return NextResponse.json({ username: session.username, wallet: row?.wallet ?? "" });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { wallet?: string } | null;
  const wallet = body?.wallet?.trim() ?? "";
  if (wallet && !walletPattern.test(wallet)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const ok = await upsertApplicant({ username: session.username, wallet });
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
