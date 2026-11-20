import { NextResponse } from "next/server";
import { getCol } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
const ALLOWED = new Set(["mm_tx_v2", "mm_debts_v2"]);

export async function GET(_req, { params }) {
  if (!ALLOWED.has(params.key)) return NextResponse.json({ error: "bad key" }, { status: 400 });
  try {
    const col = await getCol();
    const doc = await col.findOne({ _id: params.key });
    return NextResponse.json({ value: doc ? doc.value : null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!ALLOWED.has(params.key)) return NextResponse.json({ error: "bad key" }, { status: 400 });
  try {
    const { value } = await req.json();
    if (!Array.isArray(value)) return NextResponse.json({ error: "bad value" }, { status: 400 });
    const col = await getCol();
    await col.updateOne({ _id: params.key }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}
