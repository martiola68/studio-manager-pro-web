"use client";

import { useEffect, useState } from "react";

type CodicePiano = "essential" | "professional" | "studio_plus";

type Piano = {
  codice: CodicePiano;
  nome: string;
  prezzo: string;
  maxUtenti: number;
  maxAnagrafiche: number;
};

const FUNZIONI_COMUNI = [
  "Rubrica dinamica con clienti, contatti, referenti, soci, organi sociali, rappresentanti e relazioni tra soggetti.",
  "Riconoscimento e controllo del titolare effettivo sulla base di soci, organi sociali, partecipazioni e gruppi societari presenti nelle anagrafiche, con gestione dello storico delle variazioni.",
  "Agenda centralizzata per appuntamenti, riunioni, attività e impegni dello studio.",
  "Promemoria personali e condivisi con gestione delle priorità e degli alert.",
  "Post-it personali per annotazioni operative rapide dell'utente.",
  "Messaggistica interna per le comunicazioni operative tra gli utenti dello studio.",
  "Newsletter e comunicazioni massive verso i clienti selezionati.",
  "Email autocompilanti per la comunicazione delle scadenze ai clienti, con dati e riferimenti già predisposti dal gestionale.",
  "Verbali e pratiche professionali e societarie con gestione dello stato, dei documenti e dell'avanzamento.",
  "Payroll operativo: presenze, ferie, permessi, smart working e richieste di assunzione.",
  "Archivio dei portali web con collegamenti e riferimenti di accesso organizzati per cliente e servizio.",
  "Archivio dei cassetti fiscali e delle relative informazioni operative.",
  "Scadenzari fiscali centralizzati: IVA, LIPE, CU, 770, IMU, bilanci, CCGG, esterometro, proforma e ulteriori adempimenti gestiti dal sistema.",
  "Calendario unico delle scadenze per avere una visione temporale completa degli adempimenti dello studio.",
  "Alert automatici delle scadenze con preavvisi, destinatari e tracciamento degli avvisi inviati.",
  "Gestione delle scadenze degli avvisi bonari con operatore responsabile, giorni residui, contestazione, esito e stato della pratica.",
  "Richiamo dell'avviso bonario dalla cartella collegata per mantenere la continuità del fascicolo tributario.",
  "Processo tributario completo: avviso bonario, contestazione, cartella, ricorso, esiti, importi dovuti/sgravati/residui e relative scadenze.",
  "Microsoft 365 integrato per calendario, posta e riunioni collegate alle attività del gestionale.",
  "Area cliente riservata con richieste guidate, documenti e stato delle pratiche.",
  "Gestione di utenti, ruoli, permessi e responsabilità operative dello studio.",
];

const piani: Piano[] = [
  { codice: "essential", nome: "Essential", prezzo: "149 €", maxUtenti: 3, maxAnagrafiche: 25 },
  { codice: "professional", nome: "Professional", prezzo: "199 €", maxUtenti: 6, maxAnagrafiche: 50 },
  { codice: "studio_plus", nome: "Studio Plus", prezzo: "249 €", maxUtenti: 12, maxAnagrafiche: 100 },
];

const moduli = [
  {
    nome: "Antiriciclaggio",
    prezzo: "149 € / mese",
    descrizione: "Modulo completo per l'adeguata verifica e la gestione operativa AML: AV1, AV2, AV4, fascicolo cliente, rappresentanti, documentazione, valutazioni e rinnovi. Integra il controllo del titolare effettivo con soci, organi sociali, partecipazioni e gruppi societari già presenti nelle anagrafiche.",
  },
  { nome: "Revisione e controllo", prezzo: "199 € / mese", descrizione: "Checklist, verifiche, carte di lavoro, controlli periodici e follow-up delle attività di revisione." },
  { nome: "Controllo di gestione", prezzo: "129 € / mese", descrizione: "Importazione dati contabili, mappature per società, indicatori, analisi trimestrali e report gestionali." },
  { nome: "Pacchetto +3 utenti", prezzo: "45 € / mese", descrizione: "Aggiunge 3 utenti al limite previsto dal piano sottoscritto." },
  { nome: "Pacchetto +5 utenti", prezzo: "69 € / mese", descrizione: "Aggiunge 5 utenti al limite previsto dal piano sottoscritto." },
  { nome: "Pacchetto +500 anagrafiche", prezzo: "49 € / mese", descrizione: "Aumenta di 500 il limite delle anagrafiche clienti attive previste dal piano sottoscritto." },
];

const NOTA_PIANI = "Le funzionalità operative sono identiche per Essential, Professional e Studio Plus. Cambiano esclusivamente il numero massimo di utenti e di anagrafiche clienti comprese nel piano. I moduli specialistici Antiriciclaggio, Revisione e controllo e Controllo di gestione sono attivabili separatamente.";

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
      <h2>Stesse funzionalità.<br />La capacità giusta per il tuo studio.</h2>
      <div className="statementText"><p>Tutti i piani comprendono lo stesso ecosistema operativo Studio Manager Pro. La scelta dipende esclusivamente dal numero di utenti e di anagrafiche clienti necessarie.</p><p>Il contratto ha durata annuale con corrispettivo rateizzato mensilmente, salvo quanto previsto nelle condizioni contrattuali.</p></div>
    </section>

    <section className="solutionsSection" style={{ paddingTop: 30 }}>
      <div className="solutionGrid">
        {piani.map((piano, index) => <article key={piano.codice} className={index === 1 ? "solutionFeatured" : ""} style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 17, fontWeight: 950, letterSpacing: ".13em" }}>{piano.nome.toUpperCase()}</span>
          <h3 style={{ fontSize: 34, marginTop: 54 }}>{piano.prezzo} / mese</h3>
          <p style={{ minHeight: 56 }}>Tutte le funzionalità di Studio Manager Pro, con capacità dimensionata sul piano scelto.</p>
          <div style={{ display: "grid", gap: 10, margin: "20px 0 24px", paddingTop: 18, borderTop: index === 1 ? "1px solid rgba(255,255,255,.18)" : "1px solid #dce5ef" }}>
            <span style={{ fontSize: 15, fontWeight: 850, lineHeight: 1.45 }}>✓ Fino a {piano.maxUtenti} utenti registrati</span>
            <span style={{ fontSize: 15, fontWeight: 850, lineHeight: 1.45 }}>✓ Fino a {piano.maxAnagrafiche} anagrafiche clienti attive</span>
            <span style={{ fontSize: 13, lineHeight: 1.5, opacity: .82 }}>Capacità ampliabile con i pacchetti aggiuntivi disponibili.</span>
          </div>
          <button type="button" onClick={() => setPianoAperto(piano)} style={{ alignSelf: "flex-start", marginTop: "auto", padding: 0, border: 0, background: "transparent", color: "inherit", cursor: "pointer", font: "inherit", fontSize: 14, fontWeight: 850, textDecoration: "underline", textUnderlineOffset: 4 }}>Scopri tutte le funzionalità →</button>
          <a href={`/sottoscrizione?piano=${piano.codice}`} style={{ marginTop: 18 }}><b>Sottoscrivi {piano.nome} →</b></a>
        </article>)}
      </div>
    </section>

    <section className="workflowSection" style={{ paddingTop: 30 }}>
      <div className="sectionHead"><div><p className="eyebrow">MODULI E CAPACITÀ AGGIUNTIVE</p><h2>Completa il piano<br />solo dove serve.</h2></div><p>I moduli specialistici e gli incrementi di capacità sono ricorrenti mensili e possono essere selezionati durante la sottoscrizione.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
        {moduli.map((modulo) => <article key={modulo.nome} style={{ padding: 26, border: "1px solid #dce5ef", borderRadius: 14, background: "white" }}>
          <p style={{ margin: 0, color: "#0756b6", fontSize: 20, lineHeight: 1.2, fontWeight: 950 }}>{modulo.prezzo}</p>
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
      <div style={{ width: "min(820px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: "32px 34px", borderRadius: 22, background: "#fff", color: "#0d1d34", boxShadow: "0 30px 90px rgba(0,0,0,.28)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start" }}>
          <div><p className="eyebrow" style={{ marginBottom: 10 }}>PIANO {pianoAperto.nome.toUpperCase()}</p><h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.05 }}>Tutto ciò che comprende</h2><p style={{ margin: "12px 0 0", color: "#62718a", lineHeight: 1.65 }}>Le funzionalità sono le stesse per tutti i piani. Per {pianoAperto.nome} cambia esclusivamente la capacità inclusa nell'abbonamento.</p></div>
          <button type="button" aria-label="Chiudi" onClick={() => setPianoAperto(null)} style={{ width: 40, height: 40, flex: "0 0 40px", border: "1px solid #dce5ef", borderRadius: "50%", background: "white", color: "#0d1d34", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, margin: "26px 0", padding: 18, borderRadius: 14, background: "#f3f7fb" }}>
          <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.45 }}>✓ Fino a {pianoAperto.maxUtenti} utenti registrati</div>
          <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.45 }}>✓ Fino a {pianoAperto.maxAnagrafiche} anagrafiche clienti attive</div>
        </div>
        <div style={{ display: "grid", gap: 0, borderTop: "1px solid #dce5ef" }}>
          {FUNZIONI_COMUNI.map((funzione) => <div key={funzione} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "13px 0", borderBottom: "1px solid #e7edf4", lineHeight: 1.55 }}><span style={{ color: "#0879c8", fontWeight: 950 }}>✓</span><span>{funzione}</span></div>)}
        </div>
        <p style={{ margin: "20px 0 0", padding: 15, borderRadius: 12, background: "#eef7ff", color: "#36516f", fontSize: 13, lineHeight: 1.6 }}>{NOTA_PIANI}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}><button type="button" onClick={() => setPianoAperto(null)} style={{ padding: "12px 18px", border: "1px solid #dce5ef", borderRadius: 10, background: "white", cursor: "pointer", fontWeight: 800 }}>Chiudi</button><a href={`/sottoscrizione?piano=${pianoAperto.codice}`} className="primaryButton">Sottoscrivi {pianoAperto.nome} <span>→</span></a></div>
      </div>
    </div>}
  </main>;
}
