import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function context(request: Request) {
  const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token || !url || !key) throw new Error("UNAUTHORIZED");

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth, error } = await db.auth.getUser(token);
  if (error || !auth.user?.email) throw new Error("UNAUTHORIZED");

  const email = auth.user.email.toLowerCase();
  const { data: user } = await db
    .from("tbutenti")
    .select("studio_id,tipo_utente,attivo")
    .ilike("email", email)
    .maybeSingle();

  if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");
  return { db, studioId: String(user.studio_id), authUserId: auth.user.id };
}

export async function POST(request: Request) {
  try {
    const { db, studioId, authUserId } = await context(request);

    const { data: studio } = await db
      .from("tbstudio")
      .select("id,licenze_bypass,stato_cancellazione")
      .eq("id", studioId)
      .single();

    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");
    if (studio.stato_cancellazione === "programmata") {
      return NextResponse.json({ ok: true, already_requested: true });
    }

    const now = new Date();
    const scheduled = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: updateError } = await db
      .from("tbstudio")
      .update({
        data_richiesta_cancellazione: now.toISOString(),
        data_cancellazione_programmata: scheduled.toISOString(),
        stato_cancellazione: "programmata",
      })
      .eq("id", studioId);

    if (updateError) throw updateError;

    await db.from("tbstudio_cancellazioni_log").insert({
      studio_id: studioId,
      auth_user_id: authUserId,
      tipo_evento: "richiesta_cancellazione",
      data_cancellazione_programmata: scheduled.toISOString(),
      esito: "programmata",
    });

    return NextResponse.json({ ok: true, data_cancellazione_programmata: scheduled.toISOString() });
  } catch (error: any) {
    console.error("abbonamento/cancellazione POST:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile programmare la cancellazione dei dati" }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const { db, studioId, authUserId } = await context(request);

    const { error: updateError } = await db
      .from("tbstudio")
      .update({
        data_richiesta_cancellazione: null,
        data_cancellazione_programmata: null,
        stato_cancellazione: "annullata",
      })
      .eq("id", studioId);

    if (updateError) throw updateError;

    await db.from("tbstudio_cancellazioni_log").insert({
      studio_id: studioId,
      auth_user_id: authUserId,
      tipo_evento: "annullamento_cancellazione",
      esito: "annullata",
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("abbonamento/cancellazione DELETE:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile annullare la cancellazione dei dati" }, { status });
  }
}
