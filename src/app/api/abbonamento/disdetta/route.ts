import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

async function context(request: Request) {
  const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!token || !url || !key || !stripeKey) throw new Error("UNAUTHORIZED");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth, error } = await db.auth.getUser(token);
  if (error || !auth.user?.email) throw new Error("UNAUTHORIZED");
  const { data: user } = await db.from("tbutenti").select("studio_id,tipo_utente,attivo").ilike("email", auth.user.email).maybeSingle();
  if (!user?.studio_id || !user.attivo || user.tipo_utente !== "Admin") throw new Error("FORBIDDEN");
  const { data: license } = await db.from("tbsoftware_licenze").select("id,stripe_subscription_id,data_scadenza,rinnovo_automatico").eq("studio_id", user.studio_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!license?.id || !license.stripe_subscription_id || !license.data_scadenza) throw new Error("NOT_FOUND");
  return { db, stripe: new Stripe(stripeKey), license };
}

export async function POST(request: Request) {
  try {
    const { db, stripe, license } = await context(request);
    const end = new Date(`${license.data_scadenza}T23:59:59Z`);
    if (Number.isNaN(end.getTime())) throw new Error("INVALID_END");
    await stripe.subscriptions.update(license.stripe_subscription_id, { cancel_at: Math.floor(end.getTime() / 1000), cancel_at_period_end: false });
    await db.from("tbsoftware_licenze").update({ rinnovo_automatico: false, stripe_cancel_at_period_end: true }).eq("id", license.id);
    return NextResponse.json({ ok: true, service_until: license.data_scadenza });
  } catch (error: any) {
    console.error("abbonamento/disdetta POST:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile registrare la disdetta" }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const { db, stripe, license } = await context(request);
    await stripe.subscriptions.update(license.stripe_subscription_id, { cancel_at: null, cancel_at_period_end: false });
    await db.from("tbsoftware_licenze").update({ rinnovo_automatico: true, stripe_cancel_at_period_end: false }).eq("id", license.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("abbonamento/disdetta DELETE:", error);
    const status = error?.message === "UNAUTHORIZED" ? 401 : error?.message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: "Impossibile annullare la disdetta" }, { status });
  }
}
