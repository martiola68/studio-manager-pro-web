import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const codiceFiscale = String(body?.codice_fiscale || "").trim().toUpperCase().replace(/\s+/g, "");
    const newPassword = String(body?.new_password || "");
    const setupSecret = String(body?.setup_secret || "");

    const expectedSecret = process.env.SUBSCRIPTION_TEST_SETUP_SECRET;
    if (!expectedSecret || !setupSecret || setupSecret !== expectedSecret) {
      return NextResponse.json({ error: "Operazione non autorizzata" }, { status: 403 });
    }

    if (!email || !email.includes("@") || !codiceFiscale || newPassword.length < 10) {
      return NextResponse.json({ error: "Inserisci email, codice fiscale e una password di almeno 10 caratteri" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Configurazione Supabase mancante");

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: utente, error: utenteError } = await admin
      .from("tbutenti")
      .select("id,studio_id,tipo_utente,attivo,email")
      .ilike("email", email)
      .maybeSingle();

    if (utenteError || !utente?.id || !utente.studio_id || !utente.attivo || utente.tipo_utente !== "Admin") {
      return NextResponse.json({ error: "Utente amministratore non valido" }, { status: 404 });
    }

    const { data: studio, error: studioError } = await admin
      .from("tbstudio")
      .select("id,codice_fiscale,licenze_bypass")
      .eq("id", utente.studio_id)
      .maybeSingle();

    const cfStudio = String(studio?.codice_fiscale || "").trim().toUpperCase().replace(/\s+/g, "");
    if (studioError || !studio?.id || studio.licenze_bypass || cfStudio !== codiceFiscale) {
      return NextResponse.json({ error: "Codice fiscale studio non valido" }, { status: 401 });
    }

    const { data: usersPage, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) throw listError;
    const authUser = usersPage.users.find((u) => String(u.email || "").toLowerCase() === email);
    if (!authUser?.id) {
      return NextResponse.json({ error: "Utente Supabase Auth non trovato" }, { status: 404 });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(authUser.id, {
      password: newPassword,
    });
    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("abbonamento/test-imposta-password:", error);
    return NextResponse.json({ error: "Impossibile impostare la password di test" }, { status: 500 });
  }
}
