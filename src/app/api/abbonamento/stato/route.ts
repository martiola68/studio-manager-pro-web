import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function context(request: Request) {
  const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("UNAUTHORIZED");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("CONFIG");

  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: auth, error: authError } = await db.auth.getUser(token);
  if (authError || !auth.user?.email) throw new Error("UNAUTHORIZED");

  const email = auth.user.email.toLowerCase();
  const { data: user, error: userError } = await db
    .from("tbutenti")
    .select("studio_id,tipo_utente,attivo")
    .ilike("email", email)
    .maybeSingle();

  if (userError) {
    console.error("abbonamento/stato tbutenti:", userError);
    throw new Error("USER_QUERY");
  }
  if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") {
    throw new Error("FORBIDDEN");
  }

  return { db, studioId: String(user.studio_id) };
}

export async function GET(request: Request) {
  try {
    const { db, studioId } = await context(request);

    // Usiamo qui soltanto colonne già presenti in produzione.
    // I campi della cancellazione dati verranno riattivati dopo la relativa migration DB.
    const { data: studio, error: studioError } = await db
      .from("tbstudio")
      .select("ragione_sociale,licenze_bypass")
      .eq("id", studioId)
      .maybeSingle();

    if (studioError) {
      console.error("abbonamento/stato tbstudio:", studioError);
      throw new Error("STUDIO_QUERY");
    }
    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");

    const { data: licenza, error: licenzaError } = await db
      .from("tbsoftware_licenze")
      .select("id,piano,stato,stripe_status,data_prossimo_pagamento,stripe_customer_id,stripe_subscription_id,stripe_current_period_end")
      .eq("studio_id", studioId)
      .limit(1)
      .maybeSingle();

    if (licenzaError) {
      console.error("abbonamento/stato tbsoftware_licenze:", licenzaError);
      throw new Error("LICENSE_QUERY");
    }
    if (!licenza) throw new Error("NOT_FOUND");

    const stripeStatus = String(licenza.stripe_status || "").toLowerCase();
    const canReactivate =
      ["canceled", "unpaid", "incomplete_expired", "paused"].includes(stripeStatus) ||
      licenza.stato === "sospeso";

    return NextResponse.json({
      ragione_sociale: studio.ragione_sociale,
      piano: licenza.piano || "—",
      stato: licenza.stato || "—",
      stripe_status: licenza.stripe_status,
      prossimo_pagamento: licenza.data_prossimo_pagamento || licenza.stripe_current_period_end || null,
      importo: null,
      valuta: "EUR",
      can_manage_payment: !!licenza.stripe_customer_id && !canReactivate,
      can_reactivate:
        !!licenza.stripe_customer_id &&
        !!licenza.stripe_subscription_id &&
        canReactivate,

      // Temporaneamente neutri finché applichiamo la migration cancellazione dati.
      deletion_status: null,
      deletion_requested_at: null,
      deletion_scheduled_at: null,
      service_ended_at: null,
      can_request_deletion: false,
      can_cancel_deletion: false,
    });
  } catch (error: any) {
    console.error("abbonamento/stato:", error);

    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sessione scaduta o non valida" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Utente non autorizzato alla gestione dello studio" }, { status: 403 });
    }
    if (error?.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Nessun abbonamento associato allo studio" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Errore durante il caricamento dell’abbonamento" },
      { status: 500 }
    );
  }
}
