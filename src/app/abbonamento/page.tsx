"use client";

import { FormEvent, useState } from "react";

const logoUrl = "https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png";

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

  return (
    <main className="subscriptionPage">
      <header className="accessHeader subscriptionHeader">
        <a href="/" className="brand">
          <img src={logoUrl} alt="" className="brandLogo" />
          <span className="brandWords">
            <strong>Studio Manager Pro</strong>
            <small>Sistema Gestionale Integrato</small>
          </span>
        </a>
        <a href="/accesso" className="backLink">← Torna alle aree di accesso</a>
      </header>

      <section className="subscriptionShell">
        <div className="subscriptionIntro">
          <p className="eyebrow">ABBONAMENTO E PAGAMENTI</p>
          <h1>Gestisci il servizio senza entrare nel gestionale.</h1>
          <p>
            Questa area resta disponibile anche se l’abbonamento è sospeso. Per proteggere
            i dati dello studio, l’accesso viene autorizzato tramite un link inviato
            all’email dell’amministratore registrato.
          </p>
          <div className="subscriptionBenefits">
            <span>✓ Aggiorna metodo di pagamento</span>
            <span>✓ Recupera pagamenti insoluti</span>
            <span>✓ Riattiva l’abbonamento</span>
            <span>✓ Nessun dato completo della carta memorizzato in SMP</span>
          </div>
        </div>

        <div className="subscriptionLoginCard">
          <span className="accessNumber">01</span>
          <p className="accessType">VERIFICA SICURA</p>
          <h2>Ricevi il link di gestione</h2>
          <p className="subscriptionHint">
            Inserisci l’email dell’amministratore dello studio. Non chiediamo password né dati della carta.
          </p>

          <form onSubmit={submit} className="subscriptionForm">
            <label htmlFor="subscription-email">Email amministratore</label>
            <input
              id="subscription-email"
              type="email"
              required
              autoComplete="email"
              placeholder="amministratore@studio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Invio in corso…" : "Invia link sicuro"} <span>→</span>
            </button>
          </form>

          {message && <div className="subscriptionMessage success">{message}</div>}
          {error && <div className="subscriptionMessage error">{error}</div>}

          <small className="subscriptionPrivacy">
            Per ragioni di sicurezza la risposta non conferma l’esistenza o meno di uno studio associato all’indirizzo inserito.
          </small>
        </div>
      </section>

      <footer className="accessFooter subscriptionFooter">
        <p>© 2026 Studio Manager Pro. Creato da Artiola Mario.</p>
        <small>Gestione abbonamento protetta tramite verifica dell’indirizzo email.</small>
      </footer>
    </main>
  );
}
