import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const codiceFiscale = String(body?.codice_fiscale || "").trim().toUpperCase().replace(/\s+/g, "");

    if (!email || !email.includes("@") || !password || !codiceFiscale) {
      return NextResponse.json({ error: "Inserisci email, password e codice fiscale" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceKey) throw new Error("Configurazione Supabase mancante");

    // La password viene verificata direttamente da Supabase Auth: non viene letta o memorizzata da SMP.
    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({ email, password });
    if (authError || !authData.session || !authData.user) {
      return NextResponse.json({ error: "Credenziali o codice fiscale non corretti" }, { status: 401 });
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: utente, error: utenteError } = await admin
      .from("tbutenti")
      .select("id,studio_id,tipo_utente,attivo,email")
      .ilike("email", email)
      .maybeSingle();

    if (utenteError || !utente?.id || !utente.studio_id || !utente.attivo || utente.tipo_utente !== "Admin") {
      return NextResponse.json({ error: "Credenziali o codice fiscale non corretti" }, { status: 401 });
    }

    const { data: studio, error: studioError } = await admin
      .from("tbstudio")
      .select("id,codice_fiscale,licenze_bypass")
      .eq("id", utente.studio_id)
      .maybeSingle();

    const cfStudio = String(studio?.codice_fiscale || "").trim().toUpperCase().replace(/\s+/g, "");
    if (studioError || !studio?.id || studio.licenze_bypass || !cfStudio || cfStudio !== codiceFiscale) {
      return NextResponse.json({ error: "Credenziali o codice fiscale non corretti" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });
  } catch (error: any) {
    console.error("abbonamento/accesso:", error);
    return NextResponse.json({ error: "Accesso alla gestione abbonamento non disponibile in questo momento" }, { status: 500 });
  }
}
