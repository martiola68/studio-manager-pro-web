import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!token || !url || !key || !stripeKey) throw new Error("UNAUTHORIZED");
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: auth } = await db.auth.getUser(token);
    const email = auth.user?.email?.toLowerCase();
    if (!email) throw new Error("UNAUTHORIZED");
    const { data: user } = await db.from("tbutenti").select("studio_id,tipo_utente,attivo").ilike("email", email).maybeSingle();
    if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");
    const { data: licenza } = await db.from("tbsoftware_licenze").select("stripe_customer_id").eq("studio_id", user.studio_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!licenza?.stripe_customer_id) throw new Error("NOT_FOUND");
    const stripe = new Stripe(stripeKey);
    const site = String(process.env.NEXT_PUBLIC_SITE_URL || "https://studiomanagerpro.it").replace(/\/$/, "");
    const session = await stripe.billingPortal.sessions.create({ customer: licenza.stripe_customer_id, return_url: `${site}/abbonamento/gestione` });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("abbonamento/portale:", error);
    return NextResponse.json({ error: "Impossibile aprire la gestione del pagamento" }, { status: 400 });
  }
}
