"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

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
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <img src={logoUrl} alt="Studio Manager Pro" className={styles.logo} />
          <span className={styles.brandWords}>
            <strong>Studio Manager Pro</strong>
            <small>Sistema Gestionale Integrato</small>
          </span>
        </a>
        <a href="/accesso" className={styles.backLink}>← Torna alle aree di accesso</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.copy}>
          <p className={styles.eyebrow}>ABBONAMENTO E PAGAMENTI</p>
          <h1 className={styles.title}>
            Gestisci il tuo servizio.
            <em>In modo semplice.</em>
          </h1>
          <p className={styles.lead}>
            Aggiorna il pagamento, recupera un insoluto o riattiva Studio Manager Pro
            senza dover entrare nel gestionale. L’accesso è protetto tramite l’indirizzo
            email dell’amministratore dello studio.
          </p>

          <div className={styles.benefits}>
            <div className={styles.benefit}><span className={styles.check}>✓</span><span>Aggiorna il metodo di pagamento</span></div>
            <div className={styles.benefit}><span className={styles.check}>✓</span><span>Recupera pagamenti insoluti</span></div>
            <div className={styles.benefit}><span className={styles.check}>✓</span><span>Riattiva l’abbonamento</span></div>
            <div className={styles.benefit}><span className={styles.check}>✓</span><span>I dati completi della carta non vengono memorizzati in SMP</span></div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTop}>
            <span className={styles.step}>ACCESSO SICURO</span>
            <span className={styles.secure}>VERIFICA EMAIL</span>
          </div>
          <h2>Ricevi il link di gestione</h2>
          <p className={styles.hint}>
            Inserisci l’email dell’amministratore dello studio. Riceverai un collegamento
            personale per accedere alla gestione dell’abbonamento.
          </p>

          <form onSubmit={submit} className={styles.form}>
            <label htmlFor="subscription-email" className={styles.label}>Email amministratore</label>
            <input
              id="subscription-email"
              className={styles.input}
              type="email"
              required
              autoComplete="email"
              placeholder="amministratore@studio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Invio in corso…" : "Invia link sicuro →"}
            </button>
          </form>

          {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}
          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

          <small className={styles.privacy}>
            Per sicurezza la risposta non conferma l’esistenza o meno di uno studio associato all’indirizzo inserito.
          </small>
        </div>
      </section>

      <section className={styles.bottom}>
        <article className={styles.infoCard}>
          <span>01 · PAGAMENTI</span>
          <h3>Metodo di pagamento</h3>
          <p>Aggiorna in sicurezza la carta associata al servizio tramite Stripe.</p>
        </article>
        <article className={styles.infoCard}>
          <span>02 · INSOLUTI</span>
          <h3>Recupera il servizio</h3>
          <p>Gestisci eventuali pagamenti non riusciti anche quando l’accesso al gestionale è sospeso.</p>
        </article>
        <article className={styles.infoCard}>
          <span>03 · RIATTIVAZIONE</span>
          <h3>Torna operativo</h3>
          <p>Riattiva l’abbonamento e ripristina l’operatività dello studio.</p>
        </article>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 Studio Manager Pro. Creato da Artiola Mario.</span>
        <span>Gestione abbonamento protetta tramite verifica email.</span>
      </footer>
    </main>
  );
}
