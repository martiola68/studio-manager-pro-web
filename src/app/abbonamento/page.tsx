"use client";

import { CSSProperties, FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const logoUrl = "https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png";
const c = { ink: "#0d1d34", muted: "#62718a", blue: "#0879c8", blue2: "#0e4da5", cyan: "#62cfff", line: "#dce5ef", soft: "#f3f7fb" };

export default function AbbonamentoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/abbonamento/accesso", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, codice_fiscale: codiceFiscale }),
      });
      const data = await response.json();
      if (!response.ok || !data?.access_token || !data?.refresh_token) throw new Error(data?.error || "Accesso non riuscito");

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) throw new Error("Configurazione Supabase non disponibile");
      const supabase = createClient(url, key);
      const { error: sessionError } = await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
      if (sessionError) throw sessionError;

      // Sessione dedicata all'area abbonamento: evita qualsiasi dipendenza dal vecchio magic link.
      sessionStorage.setItem("smp_subscription_access_token", data.access_token);
      sessionStorage.setItem("smp_subscription_refresh_token", data.refresh_token);
      window.location.href = "/abbonamento/gestione";
    } catch (err: any) { setError(err?.message || "Errore durante l’accesso"); }
    finally { setLoading(false); }
  }

  const page: CSSProperties = { minHeight: "100vh", background: "#fff", color: c.ink };
  const header: CSSProperties = { width: "min(1240px, calc(100% - 48px))", minHeight: 96, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28 };
  const brand: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 13, textDecoration: "none", color: c.ink };
  const hero: CSSProperties = { position: "relative", width: "min(1420px, calc(100% - 28px))", minHeight: 700, margin: "0 auto", padding: "70px max(40px, calc((100% - 1240px)/2))", overflow: "hidden", color: "white", background: "linear-gradient(125deg, rgba(6,22,45,.99), rgba(8,42,83,.97) 58%, rgba(8,93,154,.92)), #07182f", borderRadius: 26, display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(380px,.95fr)", gap: 72, alignItems: "center" };
  const panel: CSSProperties = { position: "relative", zIndex: 1, padding: 34, border: "1px solid rgba(139,194,238,.25)", borderRadius: 20, background: "rgba(4,19,39,.58)", boxShadow: "0 35px 80px rgba(0,0,0,.26)", backdropFilter: "blur(12px)" };
  const input: CSSProperties = { width: "100%", minHeight: 52, padding: "0 15px", color: c.ink, background: "white", border: "1px solid rgba(255,255,255,.9)", borderRadius: 9, outline: "none", font: "inherit", fontSize: 14 };
  const label: CSSProperties = { display: "block", marginBottom: 8, color: "#dce9f7", fontSize: 12, fontWeight: 800 };

  return <main style={page}>
    <header style={header}>
      <a href="/" style={brand}><img src={logoUrl} alt="Studio Manager Pro" style={{ width: 62, height: 56, objectFit: "contain" }} /><span style={{ display: "flex", flexDirection: "column" }}><strong style={{ fontSize: 18 }}>Studio Manager Pro</strong><small style={{ marginTop: 2, color: "#6e7989", fontSize: 11 }}>Sistema Gestionale Integrato</small></span></a>
      <a href="/accesso" style={{ color: "#3d4b61", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>← Torna alle aree di accesso</a>
    </header>

    <section style={hero}>
      <div style={{ position: "absolute", width: 520, height: 520, right: -120, top: -180, borderRadius: "50%", filter: "blur(22px)", background: "rgba(0,166,222,.2)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ margin: "0 0 18px", color: "#6fd3ff", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>ABBONAMENTO E PAGAMENTI</p>
        <h1 style={{ margin: 0, maxWidth: 720, fontSize: "clamp(48px,5.5vw,78px)", lineHeight: .98, letterSpacing: "-.055em" }}>Gestisci il tuo servizio.<span style={{ display: "block", marginTop: 8, color: c.cyan }}>In modo semplice.</span></h1>
        <p style={{ maxWidth: 680, margin: "28px 0 0", color: "#c2d2e6", fontSize: 18, lineHeight: 1.7 }}>Aggiorna il pagamento, recupera un insoluto, riattiva o gestisci la cessazione di Studio Manager Pro senza entrare nel gestionale.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginTop: 34 }}>
          {["Aggiorna il metodo di pagamento", "Recupera pagamenti insoluti", "Riattiva l’abbonamento", "Gestisci la cancellazione dei dati"].map(item => <div key={item} style={{ display: "flex", gap: 10, color: "#dce9f7", fontSize: 13 }}><span style={{ display: "inline-flex", width: 20, height: 20, flex: "0 0 20px", alignItems: "center", justifyContent: "center", color: "#07182f", background: c.cyan, borderRadius: "50%", fontSize: 12, fontWeight: 900 }}>✓</span><span>{item}</span></div>)}
        </div>
      </div>

      <div style={panel}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid rgba(139,194,238,.18)" }}><span style={{ color: "#6fd3ff", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>ACCESSO SICURO</span><span style={{ color: "#91abc7", fontSize: 11, fontWeight: 800 }}>VERIFICA DATI</span></div>
        <h2 style={{ margin: "25px 0 9px", fontSize: 30, letterSpacing: "-.035em" }}>Accedi alla gestione</h2>
        <p style={{ margin: 0, color: "#aebfd2", fontSize: 14, lineHeight: 1.65 }}>Utilizza le credenziali dell’amministratore dello studio e il codice fiscale registrato in Studio Manager Pro.</p>
        <form onSubmit={submit} style={{ marginTop: 24 }}>
          <label htmlFor="subscription-email" style={label}>Email amministratore</label><input id="subscription-email" type="email" required autoComplete="email" placeholder="amministratore@studio.it" value={email} onChange={e=>setEmail(e.target.value)} style={input}/>
          <label htmlFor="subscription-password" style={{...label, marginTop:14}}>Password</label><input id="subscription-password" type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={input}/>
          <label htmlFor="subscription-cf" style={{...label, marginTop:14}}>Codice fiscale studio</label><input id="subscription-cf" type="text" required autoComplete="off" placeholder="Codice fiscale" value={codiceFiscale} onChange={e=>setCodiceFiscale(e.target.value.toUpperCase())} style={input}/>
          <button type="submit" disabled={loading} style={{ width: "100%", minHeight: 54, marginTop: 18, padding: "0 20px", color: "#fff", background: `linear-gradient(135deg, ${c.blue}, ${c.blue2})`, border: 0, borderRadius: 9, cursor: loading ? "wait" : "pointer", font: "inherit", fontSize: 14, fontWeight: 850, opacity: loading ? .65 : 1 }}>{loading ? "Verifica in corso…" : "Accedi alla gestione →"}</button>
        </form>
        {error && <div style={{ marginTop: 16, padding: "13px 14px", borderRadius: 8, fontSize: 12, color: "#fecaca", background: "rgba(220,38,38,.12)", border: "1px solid rgba(248,113,113,.22)" }}>{error}</div>}
        <small style={{ display: "block", marginTop: 17, color: "#7895b6", fontSize: 10, lineHeight: 1.55 }}>La password viene verificata da Supabase Auth e non viene memorizzata dal sito. L’accesso è consentito esclusivamente all’amministratore dello studio.</small>
      </div>
    </section>

    <section style={{ width: "min(1120px, calc(100% - 40px))", margin: "0 auto", padding: "56px 0 64px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
      {[["01 · PAGAMENTI","Metodo di pagamento","Aggiorna in sicurezza la carta associata al servizio tramite Stripe."],["02 · SERVIZIO","Continuità operativa","Gestisci insoluti, riattivazione e stato dell’abbonamento."],["03 · DATI","Controllo dei dati","Richiedi o annulla la cancellazione definitiva dei dati dello studio."]].map(([n,title,text])=><article key={n} style={{minHeight:150,padding:22,background:c.soft,border:`1px solid ${c.line}`,borderRadius:14}}><span style={{color:c.blue,fontSize:10,fontWeight:900,letterSpacing:".12em"}}>{n}</span><h3 style={{margin:"30px 0 8px",fontSize:17}}>{title}</h3><p style={{margin:0,color:c.muted,fontSize:12,lineHeight:1.6}}>{text}</p></article>)}
    </section>
    <footer style={{ width: "min(1240px, calc(100% - 48px))", margin: "0 auto", padding: "24px 0 34px", display: "flex", justifyContent: "space-between", gap: 24, borderTop: `1px solid ${c.line}`, color: "#718096", fontSize: 11 }}><span>© 2026 Studio Manager Pro. Creato da Artiola Mario.</span><span>Area riservata alla gestione dell’abbonamento.</span></footer>
  </main>;
}