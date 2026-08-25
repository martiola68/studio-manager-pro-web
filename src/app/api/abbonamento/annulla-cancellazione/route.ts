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
      .select("id,licenze_bypass,stato_cancellazione,data_cancellazione_programmata")
      .eq("id", user.studio_id)
      .single();
    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");

    if (studio.stato_cancellazione !== "programmata" && studio.stato_cancellazione !== "richiesta") {
      return NextResponse.json({ ok: true, already_cancelled: true });
    }

    const previousScheduledAt = studio.data_cancellazione_programmata;
    const { error: updateError } = await db.from("tbstudio").update({
      data_richiesta_cancellazione: null,
      data_cancellazione_programmata: null,
      stato_cancellazione: "annullata",
    }).eq("id", studio.id);
    if (updateError) throw updateError;

    const { error: logError } = await db.from("tbstudio_cancellazioni_log").insert({
      studio_id: studio.id,
      auth_user_id: auth.user.id,
      tipo_evento: "annullamento_cancellazione",
      data_cancellazione_programmata: previousScheduledAt,
      esito: "annullata",
      note: "Cancellazione annullata dall'amministratore tramite area abbonamento web",
    });
    if (logError) console.error("annullamento cancellazione log:", logError);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("abbonamento/annulla-cancellazione:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile annullare la cancellazione dei dati" }, { status });
  }
}
