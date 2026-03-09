import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  address: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const address = parsed.data.address.toLowerCase();
  const sb = supabaseServerAdmin();

  // Upsert owner
  const { data, error } = await sb
    .from("owners")
    .upsert({ address }, { onConflict: "address" })
    .select("id,address")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, owner: data });
}
