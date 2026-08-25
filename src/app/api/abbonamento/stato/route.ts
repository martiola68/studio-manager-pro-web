import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function context(request: Request) {
  const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("UNAUTHORIZED");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("CONFIG");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth, error } = await db.auth.getUser(token);
  if (error || !auth.user?.email) throw new Error("UNAUTHORIZED");
  const email = auth.user.email.toLowerCase();
  const { data: user } = await db.from("tbutenti").select("studio_id,tipo_utente,attivo").ilike("email", email).maybeSingle();
  if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");
  return { db, studioId: String(user.studio_id) };
}

export async function GET(request: Request) {
  try {
    const { db, studioId } = await context(request);
    const { data: studio } = await db.from("tbstudio")
      .select("ragione_sociale,licenze_bypass,stato_cancellazione,data_richiesta_cancellazione,data_cancellazione_programmata,data_cessazione_abbonamento")
      .eq("id", studioId)
      .single();
    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");

    const { data: licenza, error } = await db.from("tbsoftware_licenze")
      .select("piano,stato,stripe_status,data_prossimo_pagamento,stripe_customer_id,stripe_subscription_id")
      .eq("studio_id", studioId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error || !licenza) throw error || new Error("NOT_FOUND");

    const status = String(licenza.stripe_status || "").toLowerCase();
    const canReactivate = ["canceled","unpaid","incomplete_expired","paused"].includes(status) || licenza.stato === "sospeso";
    const deletionScheduled = studio.stato_cancellazione === "programmata" || studio.stato_cancellazione === "richiesta";

    return NextResponse.json({
      ragione_sociale: studio.ragione_sociale,
      piano: licenza.piano || "—",
      stato: licenza.stato || "—",
      stripe_status: licenza.stripe_status,
      prossimo_pagamento: licenza.data_prossimo_pagamento,
      importo: null,
      valuta: "EUR",
      can_manage_payment: !!licenza.stripe_customer_id && !canReactivate,
      can_reactivate: !!licenza.stripe_customer_id && !!licenza.stripe_subscription_id && canReactivate,
      deletion_status: studio.stato_cancellazione,
      deletion_requested_at: studio.data_richiesta_cancellazione,
      deletion_scheduled_at: studio.data_cancellazione_programmata,
      service_ended_at: studio.data_cessazione_abbonamento,
      can_request_deletion: !deletionScheduled,
      can_cancel_deletion: deletionScheduled,
    });
  } catch (error: any) {
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 404;
    return NextResponse.json({ error: status === 401 ? "Link scaduto o non valido" : "Abbonamento non disponibile" }, { status });
  }
}
