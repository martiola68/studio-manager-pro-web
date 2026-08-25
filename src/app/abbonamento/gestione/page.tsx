"use client";

import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase può essere inizializzato solo nel browser.");
  }

  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configurazione Supabase non disponibile. Verifica NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

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
};

export default function GestioneAbbonamentoPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          window.history.replaceState({}, "", window.location.pathname);
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Link scaduto o non valido. Richiedi un nuovo link di accesso.");

        const response = await fetch("/api/abbonamento/stato", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error || "Impossibile caricare l’abbonamento");
        setData(json);
      } catch (err: any) {
        setError(err?.message || "Accesso non valido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function execute(kind: "portale" | "riattiva") {
    setAction(kind);
    setError("");

    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Sessione scaduta. Richiedi un nuovo link.");

      const response = await fetch(`/api/abbonamento/${kind}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      if (!response.ok || !json?.url) throw new Error(json?.error || "Operazione non disponibile");
      window.location.href = json.url;
    } catch (err: any) {
      setError(err?.message || "Operazione non riuscita");
      setAction("");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f3f7fb", padding: "48px 20px", color: "#0d1d34" }}>
      <div style={{ width: "min(980px,100%)", margin: "0 auto" }}>
        <a href="/" style={{ fontWeight: 800, color: "#0879c8" }}>← Studio Manager Pro</a>
        <div style={{ marginTop: 28, padding: 36, background: "white", border: "1px solid #dce5ef", borderRadius: 18, boxShadow: "0 20px 55px rgba(13,29,52,.08)" }}>
          <p className="eyebrow">AREA ABBONAMENTO</p>
          <h1 style={{ fontSize: "clamp(34px,5vw,56px)", lineHeight: 1, marginBottom: 18 }}>Gestione abbonamento</h1>

          {loading && <p>Verifica dell’accesso e caricamento dei dati…</p>}
          {error && <div style={{ margin: "18px 0", padding: 14, borderRadius: 9, background: "#fff1f2", color: "#9f1239" }}>{error}</div>}

          {data && (
            <>
              <p style={{ color: "#62718a", fontSize: 17 }}>{data.ragione_sociale}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, margin: "28px 0" }}>
                <Info label="Piano" value={data.piano} />
                <Info label="Stato" value={data.stato} />
                <Info label="Stato pagamento" value={data.stripe_status || "—"} />
                <Info label="Prossimo addebito" value={data.prossimo_pagamento ? new Date(data.prossimo_pagamento).toLocaleDateString("it-IT") : "—"} />
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.can_manage_payment && (
                  <button onClick={() => execute("portale")} disabled={!!action} style={buttonStyle}>
                    {action === "portale" ? "Apertura…" : "Aggiorna metodo di pagamento"}
                  </button>
                )}
                {data.can_reactivate && (
                  <button onClick={() => execute("riattiva")} disabled={!!action} style={buttonStyle}>
                    {action === "riattiva" ? "Apertura…" : "Riattiva abbonamento"}
                  </button>
                )}
              </div>

              <p style={{ marginTop: 28, color: "#62718a", fontSize: 13, lineHeight: 1.6 }}>
                I dati completi della carta non vengono memorizzati da Studio Manager Pro. La gestione del metodo di pagamento avviene sui sistemi Stripe.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const buttonStyle = {
  border: 0,
  borderRadius: 9,
  padding: "14px 20px",
  background: "linear-gradient(135deg,#0879c8,#0e4da5)",
  color: "white",
  fontWeight: 850,
  cursor: "pointer",
} as const;

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 16, background: "#f3f7fb", borderRadius: 10 }}>
      <small style={{ color: "#62718a", textTransform: "uppercase", fontWeight: 800 }}>{label}</small>
      <strong style={{ display: "block", marginTop: 7 }}>{value}</strong>
    </div>
  );
}
