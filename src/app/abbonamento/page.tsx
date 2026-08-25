"use client";

import { CSSProperties, FormEvent, useState } from "react";

const logoUrl = "https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png";

const c = {
  ink: "#0d1d34",
  muted: "#62718a",
  blue: "#0879c8",
  blue2: "#0e4da5",
  cyan: "#62cfff",
  line: "#dce5ef",
  soft: "#f3f7fb",
  night: "#06162d",
};

export default function AbbonamentoPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/abbonamento/accesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Impossibile inviare il link di accesso");
      setMessage("Se l’indirizzo corrisponde a un amministratore Studio Manager Pro, riceverai a breve un link sicuro per gestire l’abbonamento.");
    } catch (err: any) {
      setError(err?.message || "Errore durante la richiesta");
    } finally {
      setLoading(false);
    }
  }

  const page: CSSProperties = { minHeight: "100vh", background: "#fff", color: c.ink };
  const header: CSSProperties = { width: "min(1240px, calc(100% - 48px))", minHeight: 96, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28 };
  const brand: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 13, textDecoration: "none", color: c.ink };
  const hero: CSSProperties = { position: "relative", width: "min(1420px, calc(100% - 28px))", minHeight: 680, margin: "0 auto", padding: "78px max(40px, calc((100% - 1240px)/2))", overflow: "hidden", color: "white", background: "linear-gradient(125deg, rgba(6,22,45,.99), rgba(8,42,83,.97) 58%, rgba(8,93,154,.92)), #07182f", borderRadius: 26, display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(360px,.95fr)", gap: 72, alignItems: "center" };
  const panel: CSSProperties = { position: "relative", zIndex: 1, padding: 34, border: "1px solid rgba(139,194,238,.25)", borderRadius: 20, background: "rgba(4,19,39,.58)", boxShadow: "0 35px 80px rgba(0,0,0,.26)", backdropFilter: "blur(12px)" };

  return (
    <main style={page}>
      <header style={header}>
        <a href="/" style={brand}>
          <img src={logoUrl} alt="Studio Manager Pro" style={{ width: 62, height: 56, objectFit: "contain" }} />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <strong style={{ fontSize: 18, letterSpacing: "-.02em" }}>Studio Manager Pro</strong>
            <small style={{ marginTop: 2, color: "#6e7989", fontSize: 11 }}>Sistema Gestionale Integrato</small>
          </span>
        </a>
        <a href="/accesso" style={{ color: "#3d4b61", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>← Torna alle aree di accesso</a>
      </header>

      <section style={hero}>
        <div style={{ position: "absolute", width: 520, height: 520, right: -120, top: -180, borderRadius: "50%", filter: "blur(22px)", background: "rgba(0,166,222,.2)" }} />
        <div style={{ position: "absolute", width: 360, height: 360, left: "30%", bottom: -250, borderRadius: "50%", filter: "blur(22px)", background: "rgba(28,103,220,.22)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ margin: "0 0 18px", color: "#6fd3ff", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>ABBONAMENTO E PAGAMENTI</p>
          <h1 style={{ margin: 0, maxWidth: 720, fontSize: "clamp(48px,5.5vw,78px)", lineHeight: .98, letterSpacing: "-.055em" }}>
            Gestisci il tuo servizio.
            <span style={{ display: "block", marginTop: 8, color: c.cyan }}>In modo semplice.</span>
          </h1>
          <p style={{ maxWidth: 680, margin: "28px 0 0", color: "#c2d2e6", fontSize: 18, lineHeight: 1.7 }}>
            Aggiorna il pagamento, recupera un insoluto o riattiva Studio Manager Pro senza dover entrare nel gestionale. L’accesso è protetto tramite l’indirizzo email dell’amministratore dello studio.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginTop: 34 }}>
            {["Aggiorna il metodo di pagamento", "Recupera pagamenti insoluti", "Riattiva l’abbonamento", "I dati completi della carta non vengono memorizzati in SMP"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "#dce9f7", fontSize: 13, lineHeight: 1.5 }}>
                <span style={{ display: "inline-flex", width: 20, height: 20, flex: "0 0 20px", alignItems: "center", justifyContent: "center", color: "#07182f", background: c.cyan, borderRadius: "50%", fontSize: 12, fontWeight: 900 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, paddingBottom: 22, borderBottom: "1px solid rgba(139,194,238,.18)" }}>
            <span style={{ color: "#6fd3ff", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>ACCESSO SICURO</span>
            <span style={{ color: "#91abc7", fontSize: 11, fontWeight: 800 }}>VERIFICA EMAIL</span>
          </div>

          <h2 style={{ margin: "28px 0 10px", fontSize: 30, letterSpacing: "-.035em" }}>Ricevi il link di gestione</h2>
          <p style={{ margin: 0, color: "#aebfd2", fontSize: 14, lineHeight: 1.7 }}>
            Inserisci l’email dell’amministratore dello studio. Riceverai un collegamento personale per accedere alla gestione dell’abbonamento.
          </p>

          <form onSubmit={submit} style={{ marginTop: 28 }}>
            <label htmlFor="subscription-email" style={{ display: "block", marginBottom: 9, color: "#dce9f7", fontSize: 12, fontWeight: 800 }}>Email amministratore</label>
            <input
              id="subscription-email"
              type="email"
              required
              autoComplete="email"
              placeholder="amministratore@studio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", minHeight: 54, padding: "0 15px", color: c.ink, background: "white", border: "1px solid rgba(255,255,255,.9)", borderRadius: 9, outline: "none", font: "inherit", fontSize: 14 }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", minHeight: 54, marginTop: 14, padding: "0 20px", color: "#fff", background: `linear-gradient(135deg, ${c.blue}, ${c.blue2})`, border: 0, borderRadius: 9, cursor: loading ? "wait" : "pointer", font: "inherit", fontSize: 14, fontWeight: 850, opacity: loading ? .65 : 1 }}>
              {loading ? "Invio in corso…" : "Invia link sicuro →"}
            </button>
          </form>

          {message && <div style={{ marginTop: 16, padding: "13px 14px", borderRadius: 8, fontSize: 12, lineHeight: 1.55, color: "#c9f6df", background: "rgba(22,163,74,.12)", border: "1px solid rgba(74,222,128,.22)" }}>{message}</div>}
          {error && <div style={{ marginTop: 16, padding: "13px 14px", borderRadius: 8, fontSize: 12, lineHeight: 1.55, color: "#fecaca", background: "rgba(220,38,38,.12)", border: "1px solid rgba(248,113,113,.22)" }}>{error}</div>}

          <small style={{ display: "block", marginTop: 17, color: "#7895b6", fontSize: 10, lineHeight: 1.55 }}>
            Per sicurezza la risposta non conferma l’esistenza o meno di uno studio associato all’indirizzo inserito.
          </small>
        </div>
      </section>

      <section style={{ width: "min(1120px, calc(100% - 40px))", margin: "0 auto", padding: "56px 0 64px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
        {[
          ["01 · PAGAMENTI", "Metodo di pagamento", "Aggiorna in sicurezza la carta associata al servizio tramite Stripe."],
          ["02 · INSOLUTI", "Recupera il servizio", "Gestisci eventuali pagamenti non riusciti anche quando l’accesso al gestionale è sospeso."],
          ["03 · RIATTIVAZIONE", "Torna operativo", "Riattiva l’abbonamento e ripristina l’operatività dello studio."],
        ].map(([n, title, text]) => (
          <article key={n} style={{ minHeight: 150, padding: 22, background: c.soft, border: `1px solid ${c.line}`, borderRadius: 14 }}>
            <span style={{ color: c.blue, fontSize: 10, fontWeight: 900, letterSpacing: ".12em" }}>{n}</span>
            <h3 style={{ margin: "30px 0 8px", fontSize: 17 }}>{title}</h3>
            <p style={{ margin: 0, color: c.muted, fontSize: 12, lineHeight: 1.6 }}>{text}</p>
          </article>
        ))}
      </section>

      <footer style={{ width: "min(1240px, calc(100% - 48px))", margin: "0 auto", padding: "24px 0 34px", display: "flex", justifyContent: "space-between", gap: 24, borderTop: `1px solid ${c.line}`, color: "#718096", fontSize: 11 }}>
        <span>© 2026 Studio Manager Pro. Creato da Artiola Mario.</span>
        <span>Gestione abbonamento protetta tramite verifica email.</span>
      </footer>
    </main>
  );
}
