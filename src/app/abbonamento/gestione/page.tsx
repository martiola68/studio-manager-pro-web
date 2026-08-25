"use client";

import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (typeof window === "undefined") throw new Error("Supabase può essere inizializzato solo nel browser.");
  if (supabaseClient) return supabaseClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Configurazione Supabase non disponibile.");
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

type SubscriptionData = {
  ragione_sociale: string;
  piano: string;
  stato: string;
  stripe_status: string | null;
  prossimo_pagamento: string | null;
  importo: number | null;
  valuta: string;
  can_manage_payment: boolean;
  can_reactivate: boolean;
  deletion_status: string | null;
  deletion_requested_at: string | null;
  deletion_scheduled_at: string | null;
  service_ended_at: string | null;
  can_request_deletion: boolean;
  can_cancel_deletion: boolean;
};

export default function GestioneAbbonamentoPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");

  async function token() {
    const supabase = getSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const value = sessionData.session?.access_token;
    if (!value) throw new Error("Sessione scaduta. Richiedi un nuovo link.");
    return value;
  }

  async function load() {
    const accessToken = await token();
    const response = await fetch("/api/abbonamento/stato", { headers: { Authorization: `Bearer ${accessToken}` } });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.error || "Impossibile caricare l’abbonamento");
    setData(json);
  }

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (sessionError) throw sessionError;
          window.history.replaceState({}, "", window.location.pathname);
        }
        await load();
      } catch (err: any) {
        setError(err?.message || "Accesso non valido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function execute(kind: "portale" | "riattiva") {
    setAction(kind); setError(""); setMessage("");
    try {
      const accessToken = await token();
      const response = await fetch(`/api/abbonamento/${kind}`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
      const json = await response.json();
      if (!response.ok || !json?.url) throw new Error(json?.error || "Operazione non disponibile");
      window.location.href = json.url;
    } catch (err: any) {
      setError(err?.message || "Operazione non riuscita"); setAction("");
    }
  }

  async function deletion(kind: "richiedi-cancellazione" | "annulla-cancellazione") {
    if (kind === "richiedi-cancellazione") {
      const ok = window.confirm("Vuoi richiedere la cancellazione definitiva di tutti i dati dello studio? La cancellazione sarà programmata tra 30 giorni e potrai annullarla fino a quel momento.");
      if (!ok) return;
    }
    setAction(kind); setError(""); setMessage("");
    try {
      const accessToken = await token();
      const response = await fetch(`/api/abbonamento/${kind}`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Operazione non disponibile");
      await load();
      setMessage(kind === "richiedi-cancellazione" ? "Richiesta registrata. I dati saranno cancellati definitivamente tra 30 giorni, salvo annullamento della richiesta." : "Richiesta di cancellazione annullata. I dati dello studio non saranno eliminati.");
    } catch (err: any) {
      setError(err?.message || "Operazione non riuscita");
    } finally {
      setAction("");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f3f7fb", padding: "48px 20px", color: "#0d1d34" }}>
      <div style={{ width: "min(1100px,100%)", margin: "0 auto" }}>
        <a href="/" style={{ fontWeight: 800, color: "#0879c8" }}>← Studio Manager Pro</a>
        <div style={cardStyle}>
          <p className="eyebrow">AREA ABBONAMENTO</p>
          <h1 style={{ fontSize: "clamp(34px,5vw,56px)", lineHeight: 1, marginBottom: 18 }}>Gestione abbonamento</h1>
          {loading && <p>Verifica dell’accesso e caricamento dei dati…</p>}
          {error && <div style={{ margin: "18px 0", padding: 14, borderRadius: 9, background: "#fff1f2", color: "#9f1239" }}>{error}</div>}
          {message && <div style={{ margin: "18px 0", padding: 14, borderRadius: 9, background: "#ecfdf5", color: "#166534" }}>{message}</div>}

          {data && <>
            <p style={{ color: "#62718a", fontSize: 17 }}>{data.ragione_sociale}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, margin: "28px 0" }}>
              <Info label="Piano" value={data.piano} /><Info label="Stato" value={data.stato} /><Info label="Stato pagamento" value={data.stripe_status || "—"} /><Info label="Prossimo addebito" value={data.prossimo_pagamento ? new Date(data.prossimo_pagamento).toLocaleDateString("it-IT") : "—"} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {data.can_manage_payment && <button onClick={() => execute("portale")} disabled={!!action} style={buttonStyle}>{action === "portale" ? "Apertura…" : "Aggiorna metodo di pagamento"}</button>}
              {data.can_reactivate && <button onClick={() => execute("riattiva")} disabled={!!action} style={buttonStyle}>{action === "riattiva" ? "Apertura…" : "Riattiva abbonamento"}</button>}
            </div>
            <p style={{ marginTop: 28, color: "#62718a", fontSize: 13, lineHeight: 1.6 }}>I dati completi della carta non vengono memorizzati da Studio Manager Pro. La gestione del metodo di pagamento avviene sui sistemi Stripe.</p>
          </>}
        </div>

        {data && <div style={{ ...cardStyle, marginTop: 22 }}>
          <p className="eyebrow">PRIVACY E DATI</p>
          <h2 style={{ fontSize: 30, margin: "8px 0 12px" }}>I dati del tuo studio</h2>
          {data.can_cancel_deletion ? <>
            <div style={{ padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa", margin: "18px 0" }}>
              <strong>Cancellazione programmata</strong>
              <p style={{ margin: "8px 0 0", color: "#7c2d12", lineHeight: 1.6 }}>La cancellazione definitiva dei dati è prevista per il <b>{data.deletion_scheduled_at ? new Date(data.deletion_scheduled_at).toLocaleDateString("it-IT") : "—"}</b>. Fino a quella data puoi annullare la richiesta.</p>
            </div>
            <button onClick={() => deletion("annulla-cancellazione")} disabled={!!action} style={buttonStyle}>{action === "annulla-cancellazione" ? "Annullamento…" : "Annulla cancellazione dati"}</button>
          </> : <>
            <p style={{ color: "#62718a", lineHeight: 1.7, maxWidth: 820 }}>Se non desideri più conservare i dati inseriti in Studio Manager Pro, puoi richiederne la cancellazione definitiva. La richiesta non elimina immediatamente i dati: viene applicato un periodo di 30 giorni durante il quale puoi cambiare idea e annullarla.</p>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #e4eaf1" }}>
              <button onClick={() => deletion("richiedi-cancellazione")} disabled={!!action} style={dangerStyle}>{action === "richiedi-cancellazione" ? "Registrazione richiesta…" : "Richiedi cancellazione definitiva dei dati"}</button>
            </div>
          </>}
        </div>}
      </div>
    </main>
  );
}

const cardStyle = { marginTop: 28, padding: 36, background: "white", border: "1px solid #dce5ef", borderRadius: 18, boxShadow: "0 20px 55px rgba(13,29,52,.08)" } as const;
const buttonStyle = { border: 0, borderRadius: 9, padding: "14px 20px", background: "linear-gradient(135deg,#0879c8,#0e4da5)", color: "white", fontWeight: 850, cursor: "pointer" } as const;
const dangerStyle = { ...buttonStyle, background: "#b42318" } as const;

function Info({ label, value }: { label: string; value: string }) {
  return <div style={{ padding: 16, background: "#f3f7fb", borderRadius: 10 }}><small style={{ color: "#62718a", textTransform: "uppercase", fontWeight: 800 }}>{label}</small><strong style={{ display: "block", marginTop: 7 }}>{value}</strong></div>;
}
