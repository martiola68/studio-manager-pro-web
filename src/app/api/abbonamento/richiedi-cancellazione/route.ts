import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!token || !url || !key) throw new Error("CONFIG");

    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: auth, error: authError } = await db.auth.getUser(token);
    if (authError || !auth.user?.email) throw new Error("UNAUTHORIZED");

    const email = auth.user.email.toLowerCase();
    const { data: user } = await db.from("tbutenti")
      .select("studio_id,tipo_utente,attivo")
      .ilike("email", email)
      .maybeSingle();
    if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");

    const { data: studio } = await db.from("tbstudio")
      .select("id,licenze_bypass,stato_cancellazione")
      .eq("id", user.studio_id)
      .single();
    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");

    if (studio.stato_cancellazione === "programmata" || studio.stato_cancellazione === "richiesta") {
      return NextResponse.json({ ok: true, already_scheduled: true });
    }

    const now = new Date();
    const scheduled = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: updateError } = await db.from("tbstudio").update({
      data_richiesta_cancellazione: now.toISOString(),
      data_cancellazione_programmata: scheduled.toISOString(),
      stato_cancellazione: "programmata",
    }).eq("id", studio.id);
    if (updateError) throw updateError;

    const { error: logError } = await db.from("tbstudio_cancellazioni_log").insert({
      studio_id: studio.id,
      auth_user_id: auth.user.id,
      tipo_evento: "richiesta_cancellazione",
      data_cancellazione_programmata: scheduled.toISOString(),
      esito: "programmata",
      note: "Richiesta effettuata dall'amministratore tramite area abbonamento web",
    });
    if (logError) console.error("cancellazione log:", logError);

    return NextResponse.json({ ok: true, deletion_scheduled_at: scheduled.toISOString() });
  } catch (error: any) {
    console.error("abbonamento/richiedi-cancellazione:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile programmare la cancellazione dei dati" }, { status });
  }
}
