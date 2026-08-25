import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Inserisci un indirizzo email valido" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const publicUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "https://studiomanagerpro.it").replace(/\/$/, "");
    if (!url || !serviceKey) throw new Error("Configurazione Supabase mancante");

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    const { data: utente, error: utenteError } = await supabase
      .from("tbutenti")
      .select("id, studio_id, tipo_utente, attivo, email")
      .ilike("email", email)
      .maybeSingle();

    // Risposta volutamente neutra: non rivela se l'indirizzo esiste nel sistema.
    if (utenteError || !utente?.id || !utente.studio_id || !utente.attivo || utente.tipo_utente !== "Admin") {
      return NextResponse.json({ ok: true });
    }

    const { data: studio } = await supabase
      .from("tbstudio")
      .select("id, licenze_bypass")
      .eq("id", utente.studio_id)
      .maybeSingle();

    if (!studio?.id || studio.licenze_bypass) return NextResponse.json({ ok: true });

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${publicUrl}/abbonamento/gestione`,
      },
    });

    if (error || !data?.properties?.action_link) throw error || new Error("Link di accesso non generato");

    // Supabase invia normalmente i magic link tramite signInWithOtp; generateLink genera il link
    // senza inviarlo. Per non dipendere da un provider email del sito, usiamo l'endpoint Auth OTP.
    const authClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: otpError } = await authClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${publicUrl}/abbonamento/gestione`,
      },
    });
    if (otpError) throw otpError;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("abbonamento/accesso:", error);
    return NextResponse.json({ error: "Impossibile inviare il link di accesso in questo momento" }, { status: 500 });
  }
}
