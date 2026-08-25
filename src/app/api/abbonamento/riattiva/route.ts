import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!token || !url || !key || !stripeKey) throw new Error("CONFIG");
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: auth } = await db.auth.getUser(token);
    const email = auth.user?.email?.toLowerCase();
    if (!email) throw new Error("UNAUTHORIZED");
    const { data: user } = await db.from("tbutenti").select("studio_id,tipo_utente,attivo").ilike("email", email).maybeSingle();
    if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");
    const { data: studio } = await db.from("tbstudio").select("id,ragione_sociale,partita_iva,codice_fiscale,email,telefono,indirizzo,citta,provincia,cap,pec,licenze_bypass").eq("id", user.studio_id).single();
    if (!studio || studio.licenze_bypass) throw new Error("NOT_FOUND");
    const { data: licenza } = await db.from("tbsoftware_licenze")
      .select("id,piano,stato,stripe_status,stripe_customer_id,stripe_subscription_id")
      .eq("studio_id", user.studio_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!licenza?.stripe_customer_id || !licenza.stripe_subscription_id) throw new Error("NOT_FOUND");
    const status = String(licenza.stripe_status || "").toLowerCase();
    if (!["canceled","unpaid","incomplete_expired","paused"].includes(status) && licenza.stato !== "sospeso") throw new Error("NOT_REACTIVABLE");

    const stripe = new Stripe(stripeKey);
    const oldSubscription = await stripe.subscriptions.retrieve(licenza.stripe_subscription_id);
    const priceId = oldSubscription.items.data[0]?.price?.id;
    if (!priceId) throw new Error("PRICE_NOT_FOUND");
    const site = String(process.env.NEXT_PUBLIC_SITE_URL || "https://studiomanagerpro.it").replace(/\/$/, "");
    const activationId = `reactivation_${licenza.id}_${Date.now()}`;
    const metadata: Record<string,string> = {
      activation_id: activationId,
      reactivation: "true",
      studio_id: String(studio.id),
      licenza_id: String(licenza.id),
      piano: String(licenza.piano || "essential").toLowerCase().replace(/\s+/g,"_"),
      addons: "",
      ragione_sociale: String(studio.ragione_sociale || ""),
      partita_iva: String(studio.partita_iva || ""),
      codice_fiscale: String(studio.codice_fiscale || ""),
      email_studio: String(studio.email || email),
      admin_email: email,
      telefono: String(studio.telefono || ""),
      indirizzo: String(studio.indirizzo || ""),
      citta: String(studio.citta || ""),
      provincia: String(studio.provincia || ""),
      cap: String(studio.cap || ""),
      pec: String(studio.pec || ""),
      codice_sdi: "0000000",
    };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: licenza.stripe_customer_id,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_collection: "always",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      client_reference_id: activationId,
      metadata,
      subscription_data: { metadata: { reactivation: "true", studio_id: String(studio.id), licenza_id: String(licenza.id) } },
      success_url: `${site}/abbonamento/gestione?riattivato=1`,
      cancel_url: `${site}/abbonamento/gestione?annullato=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("abbonamento/riattiva:", error);
    return NextResponse.json({ error: "Riattivazione non disponibile in questo momento" }, { status: 400 });
  }
}
