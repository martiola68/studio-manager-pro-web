"use client";

import { useEffect, useState } from "react";

type Piano = {
  codice: "essential" | "professional" | "studio_plus";
  nome: string;
  prezzo: string;
  descrizione: string;
  capacita: string[];
  funzioni: string[];
  nota: string;
};

const piani: Piano[] = [
  {
    codice: "essential",
    nome: "Essential",
    prezzo: "149 €",
    descrizione: "La base operativa completa per centralizzare clienti, attività, scadenze e lavoro quotidiano dello studio.",
    capacita: ["Fino a 5 utenti inclusi", "Fino a 500 anagrafiche attive", "1 studio · ambiente cloud dedicato"],
    funzioni: [
      "Archivi di base: clienti, anagrafiche, soci e organi sociali, gruppi societari e rappresentanti",
      "Agenda, appuntamenti, attività e promemoria con alert automatici",
      "Scadenzario centralizzato per adempimenti fiscali, societari e amministrativi",
      "Pratiche professionali e societarie con gestione dello stato e dei documenti",
      "Contenzioso tributario: avvisi bonari, cartelle, ricorsi, esiti e scadenze",
      "Payroll operativo: presenze, ferie, permessi, smart working e richieste di assunzione",
      "Microsoft 365: calendario, posta e riunioni collegate al gestionale",
      "Area cliente con accesso riservato e richieste guidate",
      "Ruoli, permessi, responsabilità operative e separazione multi-tenant dei dati",
    ],
    nota: "I moduli Antiriciclaggio, Revisione e controllo e Controllo di gestione sono attivabili separatamente.",
  },
  {
    codice: "professional",
    nome: "Professional",
    prezzo: "199 €",
    descrizione: "Gestione professionale dei processi, delle pratiche e dell'operatività dello studio con un livello di controllo più strutturato.",
    capacita: ["Fino a 5 utenti inclusi", "Fino a 500 anagrafiche attive", "Espandibile con pacchetti utenti e anagrafiche"],
    funzioni: [
      "Tutte le funzionalità operative previste nel piano Essential",
      "Gestione strutturata dei processi e delle responsabilità dello studio",
      "Workflow più articolati per pratiche, scadenze, assegnazioni e avanzamento",
      "Organizzazione per utenti, ruoli, settori e responsabilità operative",
      "Tracciabilità delle attività e storico degli stati dei processi",
      "Gestione integrata tra anagrafiche, pratiche, scadenze e documenti",
      "Area cliente e collaborazione operativa studio-cliente",
      "Integrazione Microsoft 365 per calendario, comunicazioni e riunioni",
    ],
    nota: "I moduli specialistici Antiriciclaggio, Revisione e controllo e Controllo di gestione restano selezionabili come componenti aggiuntive.",
  },
  {
    codice: "studio_plus",
    nome: "Studio Plus",
    prezzo: "249 €",
    descrizione: "Configurazione estesa per studi più articolati, con maggiore esigenza di organizzazione, responsabilità e crescita operativa.",
    capacita: ["Fino a 5 utenti inclusi", "Fino a 500 anagrafiche attive", "Capacità ampliabile senza cambiare piattaforma"],
    funzioni: [
      "Tutte le funzionalità operative previste nei piani Essential e Professional",
      "Configurazione pensata per strutture con più operatori, settori e responsabilità",
      "Gestione multi-studio e separazione rigorosa degli ambienti e dei dati",
      "Ruoli e permessi configurabili per adattare l'accesso alla struttura dello studio",
      "Processi, scadenze e attività collegati agli operatori responsabili",
      "Visione centralizzata delle attività dello studio e dello stato delle pratiche",
      "Espansione tramite pacchetti utenti e blocchi aggiuntivi di anagrafiche",
      "Integrazione dell'ecosistema operativo con Microsoft 365 e Area cliente",
    ],
    nota: "I moduli specialistici possono essere aggiunti alla configurazione Studio Plus in fase di sottoscrizione.",
  },
];

const moduli = [
  {
    nome: "Antiriciclaggio",
    prezzo: "149 € / mese",
    descrizione: "Adeguata verifica e gestione operativa AML con AV1, AV2 e AV4, fascicolo cliente, rappresentanti e documentazione. Include il controllo del titolare effettivo collegato a soci, organi sociali, partecipazioni e gruppi societari presenti nelle anagrafiche, con verifica e storico delle variazioni.",
  },
  { nome: "Revisione e controllo", prezzo: "199 € / mese", descrizione: "Checklist, verifiche, carte di lavoro, controlli periodici e follow-up delle attività di revisione." },
  { nome: "Controllo di gestione", prezzo: "129 € / mese", descrizione: "Importazione dati contabili, mappature per società, indicatori, analisi trimestrali e report gestionali." },
  { nome: "Pacchetto +3 utenti", prezzo: "45 € / mese", descrizione: "Aggiunge 3 utenti alla capacità prevista dal piano sottoscritto, mantenendo ruoli e permessi indipendenti per ciascun operatore." },
  { nome: "Pacchetto +5 utenti", prezzo: "69 € / mese", descrizione: "Aggiunge 5 utenti alla capacità prevista dal piano sottoscritto, ideale per strutture con più operatori o settori." },
  { nome: "Pacchetto +500 anagrafiche", prezzo: "49 € / mese", descrizione: "Aumenta di 500 il limite delle anagrafiche attive. Il pacchetto è incrementale e consente di ampliare progressivamente la capacità dello studio." },
];

function Brand() {
  return <span className="brand"><img src="https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png" alt="" className="brandLogo" /><span className="brandWords"><strong>Studio Manager Pro</strong><small>Sistema Gestionale Integrato</small></span></span>;
}

export default function SoluzioniPage() {
  const [pianoAperto, setPianoAperto] = useState<Piano | null>(null);

  useEffect(() => {
    if (!pianoAperto) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPianoAperto(null); };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [pianoAperto]);

  return <main>
    <header className="topbar"><a href="/" aria-label="Studio Manager Pro"><Brand /></a><nav><a href="/">Sito</a><a href="/accesso">Area riservata</a></nav></header>

    <section className="statement" style={{ paddingTop: 84 }}>
      <p className="eyebrow">SOLUZIONI E PREZZI</p>
      <h2>Una configurazione chiara.<br />Un abbonamento costruito sullo studio.</h2>
      <div className="statementText"><p>Scegli il piano di partenza e aggiungi solo i moduli e le capacità che ti servono.</p><p>Il contratto ha durata annuale con corrispettivo rateizzato mensilmente, salvo quanto previsto nelle condizioni contrattuali.</p></div>
    </section>

    <section className="solutionsSection" style={{ paddingTop: 30 }}>
      <div className="solutionGrid">
        {piani.map((piano, index) => <article key={piano.codice} className={index === 1 ? "solutionFeatured" : ""} style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 15, fontWeight: 950, letterSpacing: ".13em" }}>{piano.nome.toUpperCase()}</span>
          <h3 style={{ fontSize: 34, marginTop: 62 }}>{piano.prezzo} / mese</h3>
          <p style={{ minHeight: 70 }}>{piano.descrizione}</p>
          <div style={{ display: "grid", gap: 7, margin: "20px 0 24px", paddingTop: 18, borderTop: index === 1 ? "1px solid rgba(255,255,255,.18)" : "1px solid #dce5ef" }}>
            {piano.capacita.map((voce) => <span key={voce} style={{ fontSize: 13, fontWeight: 750, lineHeight: 1.45 }}>✓ {voce}</span>)}
          </div>
          <button type="button" onClick={() => setPianoAperto(piano)} style={{ alignSelf: "flex-start", marginTop: "auto", padding: 0, border: 0, background: "transparent", color: "inherit", cursor: "pointer", font: "inherit", fontSize: 13, fontWeight: 850, textDecoration: "underline", textUnderlineOffset: 4 }}>Scopri cosa include →</button>
          <a href={`/sottoscrizione?piano=${piano.codice}`} style={{ marginTop: 18 }}><b>Sottoscrivi {piano.nome} →</b></a>
        </article>)}
      </div>
    </section>

    <section className="workflowSection" style={{ paddingTop: 30 }}>
      <div className="sectionHead"><div><p className="eyebrow">MODULI E CAPACITÀ AGGIUNTIVE</p><h2>Completa il piano<br />solo dove serve.</h2></div><p>Tutte le componenti aggiuntive sono ricorrenti mensili e possono essere selezionate durante la sottoscrizione.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
        {moduli.map((modulo) => <article key={modulo.nome} style={{ padding: 26, border: "1px solid #dce5ef", borderRadius: 14, background: "white" }}>
          <p style={{ margin: 0, color: "#0756b6", fontSize: 18, lineHeight: 1.2, fontWeight: 950 }}>{modulo.prezzo}</p>
          <h3 style={{ fontSize: 26, margin: "14px 0 10px" }}>{modulo.nome}</h3>
          <p style={{ margin: 0, color: "#62718a", lineHeight: 1.7 }}>{modulo.descrizione}</p>
        </article>)}
      </div>
    </section>

    <section className="accessBanner">
      <div><p className="eyebrow lightEyebrow">PRONTO A PARTIRE?</p><h2>Configura il tuo abbonamento e completa il contratto.</h2></div>
      <div className="accessActions"><a className="primaryButton whiteButton" href="/sottoscrizione">Sottoscrivi abbonamento/contratto <span>→</span></a></div>
    </section>

    <footer><Brand /><div className="footerCenter"><p>© 2026 Studio Manager Pro. Creato da Artiola Mario.</p><small>Opera tutelata ai sensi della Legge 22 aprile 1941, n. 633, e successive modificazioni.</small></div><a href="/accesso">Area riservata</a></footer>

    {pianoAperto && <div role="dialog" aria-modal="true" aria-label={`Funzionalità piano ${pianoAperto.nome}`} onMouseDown={(e) => { if (e.currentTarget === e.target) setPianoAperto(null); }} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 24, background: "rgba(4,18,38,.72)", backdropFilter: "blur(7px)" }}>
      <div style={{ width: "min(760px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: "32px 34px", borderRadius: 22, background: "#fff", color: "#0d1d34", boxShadow: "0 30px 90px rgba(0,0,0,.28)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start" }}>
          <div><p className="eyebrow" style={{ marginBottom: 10 }}>PIANO {pianoAperto.nome.toUpperCase()}</p><h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.05 }}>Cosa comprende</h2><p style={{ margin: "12px 0 0", color: "#62718a", lineHeight: 1.65 }}>{pianoAperto.descrizione}</p></div>
          <button type="button" aria-label="Chiudi" onClick={() => setPianoAperto(null)} style={{ width: 40, height: 40, flex: "0 0 40px", border: "1px solid #dce5ef", borderRadius: "50%", background: "white", color: "#0d1d34", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, margin: "26px 0", padding: 18, borderRadius: 14, background: "#f3f7fb" }}>
          {pianoAperto.capacita.map((voce) => <div key={voce} style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.45 }}>✓ {voce}</div>)}
        </div>
        <div style={{ display: "grid", gap: 0, borderTop: "1px solid #dce5ef" }}>
          {pianoAperto.funzioni.map((funzione) => <div key={funzione} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "13px 0", borderBottom: "1px solid #e7edf4", lineHeight: 1.55 }}><span style={{ color: "#0879c8", fontWeight: 950 }}>✓</span><span>{funzione}</span></div>)}
        </div>
        <p style={{ margin: "20px 0 0", padding: 15, borderRadius: 12, background: "#eef7ff", color: "#36516f", fontSize: 13, lineHeight: 1.6 }}>{pianoAperto.nota}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}><button type="button" onClick={() => setPianoAperto(null)} style={{ padding: "12px 18px", border: "1px solid #dce5ef", borderRadius: 10, background: "white", cursor: "pointer", fontWeight: 800 }}>Chiudi</button><a href={`/sottoscrizione?piano=${pianoAperto.codice}`} className="primaryButton">Sottoscrivi {pianoAperto.nome} <span>→</span></a></div>
      </div>
    </div>}
  </main>;
}
