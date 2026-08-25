"use client";

import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const logoUrl = "https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png";
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
  ragione_sociale: string; piano: string; stato: string; stripe_status: string | null;
  prossimo_pagamento: string | null; importo: number | null; valuta: string;
  can_manage_payment: boolean; can_reactivate: boolean; deletion_status: string | null;
  deletion_requested_at: string | null; deletion_scheduled_at: string | null;
  service_ended_at: string | null; can_request_deletion: boolean; can_cancel_deletion: boolean;
};

function Brand() {
  return <span className="brand"><img src={logoUrl} alt="" className="brandLogo" /><span className="brandWords"><strong>Studio Manager Pro</strong><small>Sistema Gestionale Integrato</small></span></span>;
}

export default function GestioneAbbonamentoPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");

  async function token() {
    const storedAccess = sessionStorage.getItem("smp_subscription_access_token");
    const storedRefresh = sessionStorage.getItem("smp_subscription_refresh_token");
    const supabase = getSupabaseClient();

    if (storedAccess && storedRefresh) {
      const { data: restored, error: restoreError } = await supabase.auth.setSession({ access_token: storedAccess, refresh_token: storedRefresh });
      if (!restoreError && restored.session?.access_token) {
        sessionStorage.setItem("smp_subscription_access_token", restored.session.access_token);
        if (restored.session.refresh_token) sessionStorage.setItem("smp_subscription_refresh_token", restored.session.refresh_token);
        return restored.session.access_token;
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const value = sessionData.session?.access_token;
    if (!value) throw new Error("Sessione scaduta. Torna all’area abbonamento ed effettua nuovamente l’accesso.");
    sessionStorage.setItem("smp_subscription_access_token", value);
    if (sessionData.session?.refresh_token) sessionStorage.setItem("smp_subscription_refresh_token", sessionData.session.refresh_token);
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
      try { await load(); }
      catch (err: any) { setError(err?.message || "Accesso non valido"); }
      finally { setLoading(false); }
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
    } catch (err: any) { setError(err?.message || "Operazione non riuscita"); setAction(""); }
  }

  async function deletion(kind: "richiedi-cancellazione" | "annulla-cancellazione") {
    if (kind === "richiedi-cancellazione" && !window.confirm("Vuoi richiedere la cancellazione definitiva di tutti i dati dello studio? La cancellazione sarà programmata tra 30 giorni e potrai annullarla fino a quel momento.")) return;
    setAction(kind); setError(""); setMessage("");
    try {
      const accessToken = await token();
      const response = await fetch(`/api/abbonamento/${kind}`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Operazione non disponibile");
      await load();
      setMessage(kind === "richiedi-cancellazione" ? "Richiesta registrata. I dati saranno cancellati definitivamente tra 30 giorni, salvo annullamento della richiesta." : "Richiesta di cancellazione annullata. I dati dello studio non saranno eliminati.");
    } catch (err: any) { setError(err?.message || "Operazione non riuscita"); }
    finally { setAction(""); }
  }

  const nextCharge = data?.prossimo_pagamento ? new Date(data.prossimo_pagamento).toLocaleDateString("it-IT") : "—";

  return <main>
    <header className="topbar"><a href="/" aria-label="Studio Manager Pro"><Brand /></a><nav aria-label="Navigazione area abbonamento"><a href="/">Sito</a><a href="/accesso">Aree di accesso</a><a className="reservedLink" href="https://app.studiomanagerpro.it/login">Gestionale <span>↗</span></a></nav></header>

    <section className="heroV2" style={{ minHeight: 700 }}><div className="heroGlow one" /><div className="heroGlow two" />
      <div className="heroMain"><p className="eyebrow lightEyebrow">AREA ABBONAMENTO</p><h1>Il tuo piano.<br /><em>Sotto controllo.</em></h1><p className="heroLead">{data?.ragione_sociale || "Gestisci abbonamento, pagamenti e continuità del servizio da un’unica area protetta."}</p>
        {loading && <p style={{ color: "#c2d2e6" }}>Verifica dell’accesso e caricamento dei dati…</p>}
        {error && <><div style={errorStyle}>{error}</div><a href="/abbonamento" style={backButtonStyle}>Torna all’accesso abbonamento →</a></>}
        {message && <div style={successStyle}>{message}</div>}
        {data && <><div className="heroProof"><span>Piano {data.piano}</span><i /><span>{data.stato}</span><i /><span>{data.stripe_status || "stato pagamento —"}</span></div><div className="heroActions" style={{ marginTop: 34 }}>
          {data.can_manage_payment && <button className="primaryButton whiteButton" style={heroButtonStyle} onClick={() => execute("portale")} disabled={!!action}>{action === "portale" ? "Apertura…" : "Aggiorna pagamento"}<span>→</span></button>}
          {data.can_reactivate && <button className="primaryButton" style={heroButtonStyle} onClick={() => execute("riattiva")} disabled={!!action}>{action === "riattiva" ? "Apertura…" : "Riattiva abbonamento"}<span>→</span></button>}
        </div></>}
      </div>
      <div className="productStage" style={{ minHeight: 500, padding: 34 }}><div className="stageGrid" /><div style={{ position: "relative", zIndex: 2 }}><p className="eyebrow lightEyebrow">IL TUO ABBONAMENTO</p><h2 style={{ margin: "0 0 28px", fontSize: 34, letterSpacing: "-.04em" }}>Stato del servizio</h2><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><DarkInfo label="Piano" value={data?.piano || "—"} /><DarkInfo label="Stato" value={data?.stato || "—"} /><DarkInfo label="Pagamento" value={data?.stripe_status || "—"} /><DarkInfo label="Prossimo addebito" value={nextCharge} /></div><div style={{ marginTop: 26, paddingTop: 22, borderTop: "1px solid rgba(139,194,238,.2)" }}><strong style={{ display: "block", fontSize: 14 }}>Pagamento protetto da Stripe</strong><p style={{ margin: "8px 0 0", color: "#9bb0c9", fontSize: 12, lineHeight: 1.7 }}>Studio Manager Pro non memorizza i dati completi della carta. La gestione del metodo di pagamento avviene sui sistemi Stripe.</p></div></div></div>
    </section>

    {data && <section className="statement"><p className="eyebrow">PRIVACY E DATI</p><h2>I dati del tuo studio.<br />Sempre sotto il tuo controllo.</h2><div className="statementText" style={{ alignItems: "start" }}><div><p>Alla cessazione del servizio i dati non vengono eliminati automaticamente. Puoi richiederne la cancellazione definitiva da questa area protetta.</p><p style={{ marginTop: 20 }}>Dopo la richiesta applichiamo un periodo di sicurezza di 30 giorni. Durante questo intervallo puoi annullare la cancellazione e mantenere intatto il tuo ambiente.</p></div><div style={privacyPanelStyle}>
      {data.can_cancel_deletion ? <><p className="eyebrow" style={{ marginBottom: 10 }}>CANCELLAZIONE PROGRAMMATA</p><h3 style={{ margin: 0, fontSize: 24 }}>Richiesta registrata</h3><p style={{ margin: "14px 0 24px", color: "#62718a", lineHeight: 1.7 }}>La cancellazione definitiva è prevista per il <strong>{data.deletion_scheduled_at ? new Date(data.deletion_scheduled_at).toLocaleDateString("it-IT") : "—"}</strong>.</p><button className="primaryButton" style={lightButtonStyle} onClick={() => deletion("annulla-cancellazione")} disabled={!!action}>{action === "annulla-cancellazione" ? "Annullamento…" : "Annulla cancellazione"}<span>→</span></button></> : <><p className="eyebrow" style={{ marginBottom: 10 }}>CANCELLAZIONE DATI</p><h3 style={{ margin: 0, fontSize: 24 }}>Richiedi l’eliminazione definitiva</h3><p style={{ margin: "14px 0 24px", color: "#62718a", lineHeight: 1.7 }}>La richiesta è separata dalla disdetta dell’abbonamento e diventa definitiva solo dopo 30 giorni.</p><button style={dangerButtonStyle} onClick={() => deletion("richiedi-cancellazione")} disabled={!!action}>{action === "richiedi-cancellazione" ? "Registrazione…" : "Richiedi cancellazione definitiva"}<span>→</span></button></>}
    </div></div></section>}

    <section className="securitySection" style={{ paddingTop: 20 }}><div className="securityPanel"><p className="eyebrow">ACCESSO PROTETTO</p><h2>Una gestione separata dal gestionale.</h2><p>Anche se il servizio è sospeso, questa area resta disponibile dopo la verifica di email, password e codice fiscale dell’amministratore.</p><div className="securityTags"><span>Credenziali Admin</span><span>Codice fiscale</span><span>Stripe</span><span>Multi-tenant</span></div></div><div className="architecture"><div className="archTop">GESTIONE ABBONAMENTO</div><div className="archRows"><div><span>Pagamento</span><small>Metodo sicuro</small></div><div><span>Servizio</span><small>Stato e riattivazione</small></div><div><span>Dati</span><small>Retention e cancellazione</small></div></div><div className="archBase"><b>Studio Manager Pro</b><span>Controllo dell’abbonamento in un’unica area</span></div></div></section>

    <footer style={{ width: "min(1240px, calc(100% - 48px))", margin: "0 auto", padding: "28px 0 38px", borderTop: "1px solid #dce5ef", color: "#718096", fontSize: 11, display: "flex", justifyContent: "space-between", gap: 20 }}><span>© 2026 Studio Manager Pro. Creato da Artiola Mario.</span><a href="/abbonamento">Gestione abbonamento</a></footer>
  </main>;
}

const heroButtonStyle = { border: 0, cursor: "pointer" } as const;
const lightButtonStyle = { border: 0, cursor: "pointer" } as const;
const backButtonStyle = { display: "inline-flex", marginTop: 14, color: "#dce9f7", fontSize: 13, fontWeight: 800, textDecoration: "none" } as const;
const dangerButtonStyle = { display: "inline-flex", minHeight: 54, padding: "0 22px", alignItems: "center", justifyContent: "center", gap: 14, color: "white", background: "#a62318", border: 0, borderRadius: 9, fontSize: 14, fontWeight: 850, cursor: "pointer" } as const;
const errorStyle = { marginTop: 20, padding: 14, borderRadius: 9, color: "#fecaca", background: "rgba(220,38,38,.16)", border: "1px solid rgba(248,113,113,.25)" } as const;
const successStyle = { marginTop: 20, padding: 14, borderRadius: 9, color: "#c9f6df", background: "rgba(22,163,74,.14)", border: "1px solid rgba(74,222,128,.22)" } as const;
const privacyPanelStyle = { padding: 28, background: "#f3f7fb", border: "1px solid #dce5ef", borderRadius: 14 } as const;

function DarkInfo({ label, value }: { label: string; value: string }) {
  return <div style={{ minHeight: 105, padding: 18, background: "rgba(12,45,81,.82)", border: "1px solid rgba(119,190,239,.22)", borderRadius: 12 }}><span style={{ display: "block", color: "#6fd3ff", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</span><strong style={{ display: "block", marginTop: 18, color: "white", fontSize: 18 }}>{value}</strong></div>;
}